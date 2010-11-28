---
layout: base
title: pubsubd
---
# Introduction : A Distributed Publish / Subscribe System
The idea is to write a distributed [publish / subscribe](http://en.wikipedia.org/wiki/Publish/subscribe) system using [Node.js](http://nodejs.org) that conforms to the following 
requirements:
 1. No single point of failure
 1. Must be distributed, with ability to grow as needed
 1. Must be fault tolerant (and still function even if most nodes go down)
 1. Must handle insane amount of both subscriptions and events
 1. Must allow users to deploy subscription code with ease (i.e., the code that *does* something when an event it is subscribed to occurs)
 1. Subscriptions should be filtered based on (configurable) event qualities which may contain complicated logic (i.e., *content-based* rather than *topic-based*)

## Basic Description
 * pubsubd is made up of nodes, each of which is running a Node.js server
 * Assume initially all nodes have a hosts file with the same list of hosts
 * Nodes are grouped into gangs
 * All events are comprised of a collection of key / value string pairs expressable in JSON
 * All events have a special key whose value is used to determine which gang should handle the event
 * All nodes should be able to accept any event (though publishers will using hashing / gang memberships to spread load)

## Initialization
On startup, all machines sort their host list and then use the same algorithm to determine the number of gangs:
{% highlight ruby %}
min(ceil(sqrt(numnodes)), 10)
{% endhighlight %}

Each machine will use the list to determine which gang they are in.  They will then accept events whose primary key hash number
is the same as their gang number.

The first machine listed in a gang is the gang leader.

## Publishers
Publishers (event generators) will hash their event's primary key to determine which gang to send the event to.  They will then
pick a random member of the gang and send their event to the random member.  If the member does not respond, they will mark that
member as dead in their host list and will try another at random.  If no gang members respond, the publisher will alert the next
gang leader (that responds) that they must accept the event.

## Recruiting
Each node will monitor its own load and will attempt to recruit other nodes to join their gang when load becomes too high.  Nodes
have the ability to refuse to join if their load is currently above some threshold.  If they decide to leave, they will tell the rest
of the members of their old gang they have left and will tell the members of the new gang they have joined.

## Periodic Checks
With some regularity each node will query the other nodes in their gang and will keep an up to date list of other nodes that are in their gang.  If a gangs membership drops below two, gang members will tell the gang leader to recruit.

## Subscriptions
Subscribers alert all gang leaders about their subscriptions.  Subscriptions include:
 1. The primary key values (in regex form) to match subscriptions for
 1. The code to eval to determine a matching event
 1. The code to be evaled when a matching event is encountered

The gang leaders will then inform each member of their gang of the subcription (passing along all of the info).