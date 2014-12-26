pinf-model-promise-actor
========================

An exploration of using promises and the actor model to implement the pinf core event loop inspired by [friam - Actors in Orleans](https://groups.google.com/d/msg/friam/5BZWwmMy_80/2jAWrwokE74J):

-

Orleans [Bernstein, Bykov, Geller, Kliot, and Thelin 2014] is based on single-threaded Actor invocations. An Actor processes a message by getting a thread from a thread pool and then returning the thread to the thread pool when the message has been processed the message:

  1. Each Actor does not share memory with other Actors.
  2. A 128-bit globally unique identifier is created for each Actor that can be used to obtain an address  for the Actor.[i]
  3. An Orleans Actor cannot be interrupted while it is taking a turn to process a message regardless of the amount of time required, e.g., time to make a system call.  In this way, Orleans avoids timing races in the value of a variable of an Actor.[1]
  4. A message sent to an Orleans Actor must return a promise[ii] [Liskov and Shira 1988; Miller, Tribble, and Shapiro 2005], which is a version of a future[Baker and Hewitt 1977].  A promise for the value of  anExpression can be created using Task.FromResult(anExpression)[2] and aPromise can be resolved using  await aPromise[3]. For example:
````
    var anActor = aFactory.GetActor(aGloballyUniqueIdentifier);
    try {...aUse(await anActor.aMethodName(...))...
      anotherUse(await anActor.anotherMethodName(...))...}
    catch ...;[4]
````
When reentrancy[iii] is enabled, the method calls for aMethodName and anotherMethodName above are executed after the current message-processing turn. 

  * If completed successfully, the value of a waiting method call is supplied in a new turn at the point of method invocation, e.g., the value of the method call for aMethodName of is supplied to aUse. 
  * If a waiting method call throws an exception, it is given to the exception handler in a new turn.

Orleans uses C# compiler “stack ripping” to create behind-the-scenes activations to execute waiting method calls.

In moving to the current version, Orleans reinforces the current trend of not exposing customers[iv] to application programmers.[v]

[1] ActorScript goes even further in this direction by enforcing that an Actor can change the value of a variable only when it is leaving the cheese.

[2] In ActorScript:  Future anExpression to create a future for anExpression

[3] In ActorScript:  ↓aFuture to resolve aFuture

[4] In ActorScript the program is:
````
    Try ...aUse(⦷anActor.aMethodName(...))...
      anotherUse(⦷anActor.anotherMethodName(...))...
    catch ...
````
[i] Also, a reference for an Orleans Actor can be created from a C# objectAddress using aFactory.CreateObjectReference(objectAddress).

[ii] Orleans uses Task<aType> for the type of a promise which corresponds to the type FuturevaTypew in ActorScript.

[iii] reentrancy allows execution of aMethodCall and anotherMethodCall to be freely interleaved

[iv] of requests, e.g., method calls. Customers are sometimes called continuations in the literature.

[v] However, Orleans does still surface customers using lower level primitives.

-
