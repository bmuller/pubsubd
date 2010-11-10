---
layout: base
title: pubsubd
---
# Introduction : A Distributed Publish / Subscribe System
The idea is to write a distributed [publish / subscribe](http://en.wikipedia.org/wiki/Publish/subscribe) system using [Node.js](http://nodejs.org) that conforms to the following 
requirements:
 1. No SPoF
 1. Must be distributed, with ability to grow as needed
 1. Must handle insane amount of both subscriptions and events
 1. Must allow users to deploy subscription code with ease (i.e., the code that *does* something when an event it is subscribed to occurs)
 1. Subscriptions should be filtered based on (configurable) event qualities which may contain complicated logic (i.e., *content-based* rather than *topic-based*)

## Topology
 * Assume initially all nodes have the same hosts file which contains a list of all available servers.
 * Nodes are grouped into gangs


## Initialization
On startup, all nodes determine 

