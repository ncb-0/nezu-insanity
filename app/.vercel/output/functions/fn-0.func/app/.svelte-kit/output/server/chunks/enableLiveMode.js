import crypto from "node:crypto";
import { SanityClient } from "@sanity/client";
import { stegaEncodeSourceMap } from "@sanity/client/stega";
import { U } from "./createQueryStore.js";
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
const byteToHex = [];
for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}
const rnds8Pool = new Uint8Array(256);
let poolPtr = rnds8Pool.length;
function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    crypto.randomFillSync(rnds8Pool);
    poolPtr = 0;
  }
  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}
const native = {
  randomUUID: crypto.randomUUID
};
function v4(options, buf, offset) {
  if (native.randomUUID && !buf && !options) {
    return native.randomUUID();
  }
  options = options || {};
  const rnds = options.random || (options.rng || rng)();
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  return unsafeStringify(rnds);
}
function getGlobal() {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
}
function getDevTools() {
  const w = getGlobal();
  if (!!w.__xstate__) {
    return w.__xstate__;
  }
  return void 0;
}
const devToolsAdapter = (service) => {
  if (typeof window === "undefined") {
    return;
  }
  const devTools = getDevTools();
  if (devTools) {
    devTools.register(service);
  }
};
class Mailbox {
  constructor(_process) {
    this._process = _process;
    this._active = false;
    this._current = null;
    this._last = null;
  }
  start() {
    this._active = true;
    this.flush();
  }
  clear() {
    if (this._current) {
      this._current.next = null;
      this._last = this._current;
    }
  }
  enqueue(event) {
    const enqueued = {
      value: event,
      next: null
    };
    if (this._current) {
      this._last.next = enqueued;
      this._last = enqueued;
      return;
    }
    this._current = enqueued;
    this._last = enqueued;
    if (this._active) {
      this.flush();
    }
  }
  flush() {
    while (this._current) {
      const consumed = this._current;
      this._process(consumed.value);
      this._current = consumed.next;
    }
    this._last = null;
  }
}
const STATE_DELIMITER = ".";
const TARGETLESS_KEY = "";
const NULL_EVENT = "";
const STATE_IDENTIFIER$1 = "#";
const WILDCARD = "*";
const XSTATE_INIT = "xstate.init";
const XSTATE_ERROR = "xstate.error";
const XSTATE_STOP = "xstate.stop";
function createAfterEvent(delayRef, id) {
  return {
    type: `xstate.after.${delayRef}.${id}`
  };
}
function createDoneStateEvent(id, output) {
  return {
    type: `xstate.done.state.${id}`,
    output
  };
}
function createDoneActorEvent(invokeId, output) {
  return {
    type: `xstate.done.actor.${invokeId}`,
    output,
    actorId: invokeId
  };
}
function createErrorActorEvent(id, error) {
  return {
    type: `xstate.error.actor.${id}`,
    error,
    actorId: id
  };
}
function createInitEvent(input) {
  return {
    type: XSTATE_INIT,
    input
  };
}
function reportUnhandledError$2(err) {
  setTimeout(() => {
    throw err;
  });
}
const symbolObservable = (() => typeof Symbol === "function" && Symbol.observable || "@@observable")();
function matchesState(parentStateId, childStateId) {
  const parentStateValue = toStateValue(parentStateId);
  const childStateValue = toStateValue(childStateId);
  if (typeof childStateValue === "string") {
    if (typeof parentStateValue === "string") {
      return childStateValue === parentStateValue;
    }
    return false;
  }
  if (typeof parentStateValue === "string") {
    return parentStateValue in childStateValue;
  }
  return Object.keys(parentStateValue).every((key) => {
    if (!(key in childStateValue)) {
      return false;
    }
    return matchesState(parentStateValue[key], childStateValue[key]);
  });
}
function toStatePath(stateId) {
  if (isArray$3(stateId)) {
    return stateId;
  }
  let result = [];
  let segment = "";
  for (let i = 0; i < stateId.length; i++) {
    const char = stateId.charCodeAt(i);
    switch (char) {
      case 92:
        segment += stateId[i + 1];
        i++;
        continue;
      case 46:
        result.push(segment);
        segment = "";
        continue;
    }
    segment += stateId[i];
  }
  result.push(segment);
  return result;
}
function toStateValue(stateValue) {
  if (isMachineSnapshot(stateValue)) {
    return stateValue.value;
  }
  if (typeof stateValue !== "string") {
    return stateValue;
  }
  const statePath = toStatePath(stateValue);
  return pathToStateValue(statePath);
}
function pathToStateValue(statePath) {
  if (statePath.length === 1) {
    return statePath[0];
  }
  const value = {};
  let marker = value;
  for (let i = 0; i < statePath.length - 1; i++) {
    if (i === statePath.length - 2) {
      marker[statePath[i]] = statePath[i + 1];
    } else {
      const previous = marker;
      marker = {};
      previous[statePath[i]] = marker;
    }
  }
  return value;
}
function mapValues(collection, iteratee) {
  const result = {};
  const collectionKeys = Object.keys(collection);
  for (let i = 0; i < collectionKeys.length; i++) {
    const key = collectionKeys[i];
    result[key] = iteratee(collection[key], key, collection, i);
  }
  return result;
}
function toArrayStrict(value) {
  if (isArray$3(value)) {
    return value;
  }
  return [value];
}
function toArray$2(value) {
  if (value === void 0) {
    return [];
  }
  return toArrayStrict(value);
}
function resolveOutput(mapper, context2, event, self2) {
  if (typeof mapper === "function") {
    return mapper({
      context: context2,
      event,
      self: self2
    });
  }
  return mapper;
}
function isArray$3(value) {
  return Array.isArray(value);
}
function isErrorActorEvent(event) {
  return event.type.startsWith("xstate.error.actor");
}
function toTransitionConfigArray(configLike) {
  return toArrayStrict(configLike).map((transitionLike) => {
    if (typeof transitionLike === "undefined" || typeof transitionLike === "string") {
      return {
        target: transitionLike
      };
    }
    return transitionLike;
  });
}
function normalizeTarget(target) {
  if (target === void 0 || target === TARGETLESS_KEY) {
    return void 0;
  }
  return toArray$2(target);
}
function toObserver(nextHandler, errorHandler, completionHandler) {
  const isObserver2 = typeof nextHandler === "object";
  const self2 = isObserver2 ? nextHandler : void 0;
  return {
    next: (isObserver2 ? nextHandler.next : nextHandler)?.bind(self2),
    error: (isObserver2 ? nextHandler.error : errorHandler)?.bind(self2),
    complete: (isObserver2 ? nextHandler.complete : completionHandler)?.bind(self2)
  };
}
function createInvokeId(stateNodeId, index) {
  return `${index}.${stateNodeId}`;
}
function resolveReferencedActor(machine, src) {
  const match = src.match(/^xstate\.invoke\.(\d+)\.(.*)/);
  if (!match) {
    return machine.implementations.actors[src];
  }
  const [, indexStr, nodeId] = match;
  const node = machine.getStateNodeById(nodeId);
  const invokeConfig = node.config.invoke;
  return (Array.isArray(invokeConfig) ? invokeConfig[indexStr] : invokeConfig).src;
}
function createScheduledEventId(actorRef, id) {
  return `${actorRef.sessionId}.${id}`;
}
let idCounter = 0;
function createSystem(rootActor, options) {
  const children = /* @__PURE__ */ new Map();
  const keyedActors = /* @__PURE__ */ new Map();
  const reverseKeyedActors = /* @__PURE__ */ new WeakMap();
  const inspectionObservers = /* @__PURE__ */ new Set();
  const timerMap = {};
  const {
    clock,
    logger
  } = options;
  const scheduler = {
    schedule: (source, target, event, delay2, id = Math.random().toString(36).slice(2)) => {
      const scheduledEvent = {
        source,
        target,
        event,
        delay: delay2,
        id,
        startedAt: Date.now()
      };
      const scheduledEventId = createScheduledEventId(source, id);
      system._snapshot._scheduledEvents[scheduledEventId] = scheduledEvent;
      const timeout2 = clock.setTimeout(() => {
        delete timerMap[scheduledEventId];
        delete system._snapshot._scheduledEvents[scheduledEventId];
        system._relay(source, target, event);
      }, delay2);
      timerMap[scheduledEventId] = timeout2;
    },
    cancel: (source, id) => {
      const scheduledEventId = createScheduledEventId(source, id);
      const timeout2 = timerMap[scheduledEventId];
      delete timerMap[scheduledEventId];
      delete system._snapshot._scheduledEvents[scheduledEventId];
      if (timeout2 !== void 0) {
        clock.clearTimeout(timeout2);
      }
    },
    cancelAll: (actorRef) => {
      for (const scheduledEventId in system._snapshot._scheduledEvents) {
        const scheduledEvent = system._snapshot._scheduledEvents[scheduledEventId];
        if (scheduledEvent.source === actorRef) {
          scheduler.cancel(actorRef, scheduledEvent.id);
        }
      }
    }
  };
  const sendInspectionEvent = (event) => {
    if (!inspectionObservers.size) {
      return;
    }
    const resolvedInspectionEvent = {
      ...event,
      rootId: rootActor.sessionId
    };
    inspectionObservers.forEach((observer) => observer.next?.(resolvedInspectionEvent));
  };
  const system = {
    _snapshot: {
      _scheduledEvents: (options?.snapshot && options.snapshot.scheduler) ?? {}
    },
    _bookId: () => `x:${idCounter++}`,
    _register: (sessionId, actorRef) => {
      children.set(sessionId, actorRef);
      return sessionId;
    },
    _unregister: (actorRef) => {
      children.delete(actorRef.sessionId);
      const systemId = reverseKeyedActors.get(actorRef);
      if (systemId !== void 0) {
        keyedActors.delete(systemId);
        reverseKeyedActors.delete(actorRef);
      }
    },
    get: (systemId) => {
      return keyedActors.get(systemId);
    },
    _set: (systemId, actorRef) => {
      const existing = keyedActors.get(systemId);
      if (existing && existing !== actorRef) {
        throw new Error(`Actor with system ID '${systemId}' already exists.`);
      }
      keyedActors.set(systemId, actorRef);
      reverseKeyedActors.set(actorRef, systemId);
    },
    inspect: (observerOrFn) => {
      const observer = toObserver(observerOrFn);
      inspectionObservers.add(observer);
      return {
        unsubscribe() {
          inspectionObservers.delete(observer);
        }
      };
    },
    _sendInspectionEvent: sendInspectionEvent,
    _relay: (source, target, event) => {
      system._sendInspectionEvent({
        type: "@xstate.event",
        sourceRef: source,
        actorRef: target,
        event
      });
      target._send(event);
    },
    scheduler,
    getSnapshot: () => {
      return {
        _scheduledEvents: {
          ...system._snapshot._scheduledEvents
        }
      };
    },
    start: () => {
      const scheduledEvents = system._snapshot._scheduledEvents;
      system._snapshot._scheduledEvents = {};
      for (const scheduledId in scheduledEvents) {
        const {
          source,
          target,
          event,
          delay: delay2,
          id
        } = scheduledEvents[scheduledId];
        scheduler.schedule(source, target, event, delay2, id);
      }
    },
    _clock: clock,
    _logger: logger
  };
  return system;
}
const $$ACTOR_TYPE = 1;
let ProcessingStatus = /* @__PURE__ */ function(ProcessingStatus2) {
  ProcessingStatus2[ProcessingStatus2["NotStarted"] = 0] = "NotStarted";
  ProcessingStatus2[ProcessingStatus2["Running"] = 1] = "Running";
  ProcessingStatus2[ProcessingStatus2["Stopped"] = 2] = "Stopped";
  return ProcessingStatus2;
}({});
const defaultOptions = {
  clock: {
    setTimeout: (fn, ms) => {
      return setTimeout(fn, ms);
    },
    clearTimeout: (id) => {
      return clearTimeout(id);
    }
  },
  logger: console.log.bind(console),
  devTools: false
};
class Actor {
  /**
   * Creates a new actor instance for the given logic with the provided options,
   * if any.
   *
   * @param logic The logic to create an actor from
   * @param options Actor options
   */
  constructor(logic, options) {
    this.logic = logic;
    this._snapshot = void 0;
    this.clock = void 0;
    this.options = void 0;
    this.id = void 0;
    this.mailbox = new Mailbox(this._process.bind(this));
    this.observers = /* @__PURE__ */ new Set();
    this.eventListeners = /* @__PURE__ */ new Map();
    this.logger = void 0;
    this._processingStatus = ProcessingStatus.NotStarted;
    this._parent = void 0;
    this._syncSnapshot = void 0;
    this.ref = void 0;
    this._actorScope = void 0;
    this._systemId = void 0;
    this.sessionId = void 0;
    this.system = void 0;
    this._doneEvent = void 0;
    this.src = void 0;
    this._deferred = [];
    const resolvedOptions = {
      ...defaultOptions,
      ...options
    };
    const {
      clock,
      logger,
      parent,
      syncSnapshot,
      id,
      systemId,
      inspect
    } = resolvedOptions;
    this.system = parent ? parent.system : createSystem(this, {
      clock,
      logger
    });
    if (inspect && !parent) {
      this.system.inspect(toObserver(inspect));
    }
    this.sessionId = this.system._bookId();
    this.id = id ?? this.sessionId;
    this.logger = options?.logger ?? this.system._logger;
    this.clock = options?.clock ?? this.system._clock;
    this._parent = parent;
    this._syncSnapshot = syncSnapshot;
    this.options = resolvedOptions;
    this.src = resolvedOptions.src ?? logic;
    this.ref = this;
    this._actorScope = {
      self: this,
      id: this.id,
      sessionId: this.sessionId,
      logger: this.logger,
      defer: (fn) => {
        this._deferred.push(fn);
      },
      system: this.system,
      stopChild: (child) => {
        if (child._parent !== this) {
          throw new Error(`Cannot stop child actor ${child.id} of ${this.id} because it is not a child`);
        }
        child._stop();
      },
      emit: (emittedEvent) => {
        const listeners = this.eventListeners.get(emittedEvent.type);
        const wildcardListener = this.eventListeners.get("*");
        if (!listeners && !wildcardListener) {
          return;
        }
        const allListeners = /* @__PURE__ */ new Set([...listeners ? listeners.values() : [], ...wildcardListener ? wildcardListener.values() : []]);
        for (const handler of Array.from(allListeners)) {
          handler(emittedEvent);
        }
      }
    };
    this.send = this.send.bind(this);
    this.system._sendInspectionEvent({
      type: "@xstate.actor",
      actorRef: this
    });
    if (systemId) {
      this._systemId = systemId;
      this.system._set(systemId, this);
    }
    this._initState(options?.snapshot ?? options?.state);
    if (systemId && this._snapshot.status !== "active") {
      this.system._unregister(this);
    }
  }
  _initState(persistedState) {
    try {
      this._snapshot = persistedState ? this.logic.restoreSnapshot ? this.logic.restoreSnapshot(persistedState, this._actorScope) : persistedState : this.logic.getInitialSnapshot(this._actorScope, this.options?.input);
    } catch (err) {
      this._snapshot = {
        status: "error",
        output: void 0,
        error: err
      };
    }
  }
  update(snapshot, event) {
    this._snapshot = snapshot;
    let deferredFn;
    while (deferredFn = this._deferred.shift()) {
      try {
        deferredFn();
      } catch (err) {
        this._deferred.length = 0;
        this._snapshot = {
          ...snapshot,
          status: "error",
          error: err
        };
      }
    }
    switch (this._snapshot.status) {
      case "active":
        for (const observer of this.observers) {
          try {
            observer.next?.(snapshot);
          } catch (err) {
            reportUnhandledError$2(err);
          }
        }
        break;
      case "done":
        for (const observer of this.observers) {
          try {
            observer.next?.(snapshot);
          } catch (err) {
            reportUnhandledError$2(err);
          }
        }
        this._stopProcedure();
        this._complete();
        this._doneEvent = createDoneActorEvent(this.id, this._snapshot.output);
        if (this._parent) {
          this.system._relay(this, this._parent, this._doneEvent);
        }
        break;
      case "error":
        this._error(this._snapshot.error);
        break;
    }
    this.system._sendInspectionEvent({
      type: "@xstate.snapshot",
      actorRef: this,
      event,
      snapshot
    });
  }
  /**
   * Subscribe an observer to an actor’s snapshot values.
   *
   * @remarks
   * The observer will receive the actor’s snapshot value when it is emitted.
   * The observer can be:
   *
   * - A plain function that receives the latest snapshot, or
   * - An observer object whose `.next(snapshot)` method receives the latest
   *   snapshot
   *
   * @example
   *
   * ```ts
   * // Observer as a plain function
   * const subscription = actor.subscribe((snapshot) => {
   *   console.log(snapshot);
   * });
   * ```
   *
   * @example
   *
   * ```ts
   * // Observer as an object
   * const subscription = actor.subscribe({
   *   next(snapshot) {
   *     console.log(snapshot);
   *   },
   *   error(err) {
   *     // ...
   *   },
   *   complete() {
   *     // ...
   *   }
   * });
   * ```
   *
   * The return value of `actor.subscribe(observer)` is a subscription object
   * that has an `.unsubscribe()` method. You can call
   * `subscription.unsubscribe()` to unsubscribe the observer:
   *
   * @example
   *
   * ```ts
   * const subscription = actor.subscribe((snapshot) => {
   *   // ...
   * });
   *
   * // Unsubscribe the observer
   * subscription.unsubscribe();
   * ```
   *
   * When the actor is stopped, all of its observers will automatically be
   * unsubscribed.
   *
   * @param observer - Either a plain function that receives the latest
   *   snapshot, or an observer object whose `.next(snapshot)` method receives
   *   the latest snapshot
   */
  subscribe(nextListenerOrObserver, errorListener, completeListener) {
    const observer = toObserver(nextListenerOrObserver, errorListener, completeListener);
    if (this._processingStatus !== ProcessingStatus.Stopped) {
      this.observers.add(observer);
    } else {
      switch (this._snapshot.status) {
        case "done":
          try {
            observer.complete?.();
          } catch (err) {
            reportUnhandledError$2(err);
          }
          break;
        case "error": {
          const err = this._snapshot.error;
          if (!observer.error) {
            reportUnhandledError$2(err);
          } else {
            try {
              observer.error(err);
            } catch (err2) {
              reportUnhandledError$2(err2);
            }
          }
          break;
        }
      }
    }
    return {
      unsubscribe: () => {
        this.observers.delete(observer);
      }
    };
  }
  on(type, handler) {
    let listeners = this.eventListeners.get(type);
    if (!listeners) {
      listeners = /* @__PURE__ */ new Set();
      this.eventListeners.set(type, listeners);
    }
    const wrappedHandler = handler.bind(void 0);
    listeners.add(wrappedHandler);
    return {
      unsubscribe: () => {
        listeners.delete(wrappedHandler);
      }
    };
  }
  /** Starts the Actor from the initial state */
  start() {
    if (this._processingStatus === ProcessingStatus.Running) {
      return this;
    }
    if (this._syncSnapshot) {
      this.subscribe({
        next: (snapshot) => {
          if (snapshot.status === "active") {
            this.system._relay(this, this._parent, {
              type: `xstate.snapshot.${this.id}`,
              snapshot
            });
          }
        },
        error: () => {
        }
      });
    }
    this.system._register(this.sessionId, this);
    if (this._systemId) {
      this.system._set(this._systemId, this);
    }
    this._processingStatus = ProcessingStatus.Running;
    const initEvent = createInitEvent(this.options.input);
    this.system._sendInspectionEvent({
      type: "@xstate.event",
      sourceRef: this._parent,
      actorRef: this,
      event: initEvent
    });
    const status = this._snapshot.status;
    switch (status) {
      case "done":
        this.update(this._snapshot, initEvent);
        return this;
      case "error":
        this._error(this._snapshot.error);
        return this;
    }
    if (!this._parent) {
      this.system.start();
    }
    if (this.logic.start) {
      try {
        this.logic.start(this._snapshot, this._actorScope);
      } catch (err) {
        this._snapshot = {
          ...this._snapshot,
          status: "error",
          error: err
        };
        this._error(err);
        return this;
      }
    }
    this.update(this._snapshot, initEvent);
    if (this.options.devTools) {
      this.attachDevTools();
    }
    this.mailbox.start();
    return this;
  }
  _process(event) {
    let nextState;
    let caughtError;
    try {
      nextState = this.logic.transition(this._snapshot, event, this._actorScope);
    } catch (err) {
      caughtError = {
        err
      };
    }
    if (caughtError) {
      const {
        err
      } = caughtError;
      this._snapshot = {
        ...this._snapshot,
        status: "error",
        error: err
      };
      this._error(err);
      return;
    }
    this.update(nextState, event);
    if (event.type === XSTATE_STOP) {
      this._stopProcedure();
      this._complete();
    }
  }
  _stop() {
    if (this._processingStatus === ProcessingStatus.Stopped) {
      return this;
    }
    this.mailbox.clear();
    if (this._processingStatus === ProcessingStatus.NotStarted) {
      this._processingStatus = ProcessingStatus.Stopped;
      return this;
    }
    this.mailbox.enqueue({
      type: XSTATE_STOP
    });
    return this;
  }
  /** Stops the Actor and unsubscribe all listeners. */
  stop() {
    if (this._parent) {
      throw new Error("A non-root actor cannot be stopped directly.");
    }
    return this._stop();
  }
  _complete() {
    for (const observer of this.observers) {
      try {
        observer.complete?.();
      } catch (err) {
        reportUnhandledError$2(err);
      }
    }
    this.observers.clear();
  }
  _reportError(err) {
    if (!this.observers.size) {
      if (!this._parent) {
        reportUnhandledError$2(err);
      }
      return;
    }
    let reportError = false;
    for (const observer of this.observers) {
      const errorListener = observer.error;
      reportError ||= !errorListener;
      try {
        errorListener?.(err);
      } catch (err2) {
        reportUnhandledError$2(err2);
      }
    }
    this.observers.clear();
    if (reportError) {
      reportUnhandledError$2(err);
    }
  }
  _error(err) {
    this._stopProcedure();
    this._reportError(err);
    if (this._parent) {
      this.system._relay(this, this._parent, createErrorActorEvent(this.id, err));
    }
  }
  // TODO: atm children don't belong entirely to the actor so
  // in a way - it's not even super aware of them
  // so we can't stop them from here but we really should!
  // right now, they are being stopped within the machine's transition
  // but that could throw and leave us with "orphaned" active actors
  _stopProcedure() {
    if (this._processingStatus !== ProcessingStatus.Running) {
      return this;
    }
    this.system.scheduler.cancelAll(this);
    this.mailbox.clear();
    this.mailbox = new Mailbox(this._process.bind(this));
    this._processingStatus = ProcessingStatus.Stopped;
    this.system._unregister(this);
    return this;
  }
  /** @internal */
  _send(event) {
    if (this._processingStatus === ProcessingStatus.Stopped) {
      return;
    }
    this.mailbox.enqueue(event);
  }
  /**
   * Sends an event to the running Actor to trigger a transition.
   *
   * @param event The event to send
   */
  send(event) {
    this.system._relay(void 0, this, event);
  }
  attachDevTools() {
    const {
      devTools
    } = this.options;
    if (devTools) {
      const resolvedDevToolsAdapter = typeof devTools === "function" ? devTools : devToolsAdapter;
      resolvedDevToolsAdapter(this);
    }
  }
  toJSON() {
    return {
      xstate$$type: $$ACTOR_TYPE,
      id: this.id
    };
  }
  /**
   * Obtain the internal state of the actor, which can be persisted.
   *
   * @remarks
   * The internal state can be persisted from any actor, not only machines.
   *
   * Note that the persisted state is not the same as the snapshot from
   * {@link Actor.getSnapshot}. Persisted state represents the internal state of
   * the actor, while snapshots represent the actor's last emitted value.
   *
   * Can be restored with {@link ActorOptions.state}
   * @see https://stately.ai/docs/persistence
   */
  getPersistedSnapshot(options) {
    return this.logic.getPersistedSnapshot(this._snapshot, options);
  }
  [symbolObservable]() {
    return this;
  }
  /**
   * Read an actor’s snapshot synchronously.
   *
   * @remarks
   * The snapshot represent an actor's last emitted value.
   *
   * When an actor receives an event, its internal state may change. An actor
   * may emit a snapshot when a state transition occurs.
   *
   * Note that some actors, such as callback actors generated with
   * `fromCallback`, will not emit snapshots.
   * @see {@link Actor.subscribe} to subscribe to an actor’s snapshot values.
   * @see {@link Actor.getPersistedSnapshot} to persist the internal state of an actor (which is more than just a snapshot).
   */
  getSnapshot() {
    return this._snapshot;
  }
}
function createActor(logic, ...[options]) {
  return new Actor(logic, options);
}
function resolveCancel(_, snapshot, actionArgs, actionParams, {
  sendId
}) {
  const resolvedSendId = typeof sendId === "function" ? sendId(actionArgs, actionParams) : sendId;
  return [snapshot, resolvedSendId];
}
function executeCancel(actorScope, resolvedSendId) {
  actorScope.defer(() => {
    actorScope.system.scheduler.cancel(actorScope.self, resolvedSendId);
  });
}
function cancel(sendId) {
  function cancel2(args2, params) {
  }
  cancel2.type = "xstate.cancel";
  cancel2.sendId = sendId;
  cancel2.resolve = resolveCancel;
  cancel2.execute = executeCancel;
  return cancel2;
}
function resolveSpawn(actorScope, snapshot, actionArgs, _actionParams, {
  id,
  systemId,
  src,
  input,
  syncSnapshot
}) {
  const logic = typeof src === "string" ? resolveReferencedActor(snapshot.machine, src) : src;
  const resolvedId = typeof id === "function" ? id(actionArgs) : id;
  let actorRef;
  if (logic) {
    actorRef = createActor(logic, {
      id: resolvedId,
      src,
      parent: actorScope.self,
      syncSnapshot,
      systemId,
      input: typeof input === "function" ? input({
        context: snapshot.context,
        event: actionArgs.event,
        self: actorScope.self
      }) : input
    });
  }
  return [cloneMachineSnapshot(snapshot, {
    children: {
      ...snapshot.children,
      [resolvedId]: actorRef
    }
  }), {
    id,
    actorRef
  }];
}
function executeSpawn(actorScope, {
  id,
  actorRef
}) {
  if (!actorRef) {
    return;
  }
  actorScope.defer(() => {
    if (actorRef._processingStatus === ProcessingStatus.Stopped) {
      return;
    }
    actorRef.start();
  });
}
function spawnChild(...[src, {
  id,
  systemId,
  input,
  syncSnapshot = false
} = {}]) {
  function spawnChild2(args2, params) {
  }
  spawnChild2.type = "snapshot.spawnChild";
  spawnChild2.id = id;
  spawnChild2.systemId = systemId;
  spawnChild2.src = src;
  spawnChild2.input = input;
  spawnChild2.syncSnapshot = syncSnapshot;
  spawnChild2.resolve = resolveSpawn;
  spawnChild2.execute = executeSpawn;
  return spawnChild2;
}
function resolveStop(_, snapshot, args2, actionParams, {
  actorRef
}) {
  const actorRefOrString = typeof actorRef === "function" ? actorRef(args2, actionParams) : actorRef;
  const resolvedActorRef = typeof actorRefOrString === "string" ? snapshot.children[actorRefOrString] : actorRefOrString;
  let children = snapshot.children;
  if (resolvedActorRef) {
    children = {
      ...children
    };
    delete children[resolvedActorRef.id];
  }
  return [cloneMachineSnapshot(snapshot, {
    children
  }), resolvedActorRef];
}
function executeStop(actorScope, actorRef) {
  if (!actorRef) {
    return;
  }
  actorScope.system._unregister(actorRef);
  if (actorRef._processingStatus !== ProcessingStatus.Running) {
    actorScope.stopChild(actorRef);
    return;
  }
  actorScope.defer(() => {
    actorScope.stopChild(actorRef);
  });
}
function stopChild(actorRef) {
  function stop(args2, params) {
  }
  stop.type = "xstate.stopChild";
  stop.actorRef = actorRef;
  stop.resolve = resolveStop;
  stop.execute = executeStop;
  return stop;
}
function evaluateGuard(guard, context2, event, snapshot) {
  const {
    machine
  } = snapshot;
  const isInline = typeof guard === "function";
  const resolved2 = isInline ? guard : machine.implementations.guards[typeof guard === "string" ? guard : guard.type];
  if (!isInline && !resolved2) {
    throw new Error(`Guard '${typeof guard === "string" ? guard : guard.type}' is not implemented.'.`);
  }
  if (typeof resolved2 !== "function") {
    return evaluateGuard(resolved2, context2, event, snapshot);
  }
  const guardArgs = {
    context: context2,
    event
  };
  const guardParams = isInline || typeof guard === "string" ? void 0 : "params" in guard ? typeof guard.params === "function" ? guard.params({
    context: context2,
    event
  }) : guard.params : void 0;
  if (!("check" in resolved2)) {
    return resolved2(guardArgs, guardParams);
  }
  const builtinGuard = resolved2;
  return builtinGuard.check(
    snapshot,
    guardArgs,
    resolved2
    // this holds all params
  );
}
const isAtomicStateNode = (stateNode) => stateNode.type === "atomic" || stateNode.type === "final";
function getChildren(stateNode) {
  return Object.values(stateNode.states).filter((sn) => sn.type !== "history");
}
function getProperAncestors(stateNode, toStateNode) {
  const ancestors = [];
  if (toStateNode === stateNode) {
    return ancestors;
  }
  let m = stateNode.parent;
  while (m && m !== toStateNode) {
    ancestors.push(m);
    m = m.parent;
  }
  return ancestors;
}
function getAllStateNodes(stateNodes) {
  const nodeSet = new Set(stateNodes);
  const adjList = getAdjList(nodeSet);
  for (const s of nodeSet) {
    if (s.type === "compound" && (!adjList.get(s) || !adjList.get(s).length)) {
      getInitialStateNodesWithTheirAncestors(s).forEach((sn) => nodeSet.add(sn));
    } else {
      if (s.type === "parallel") {
        for (const child of getChildren(s)) {
          if (child.type === "history") {
            continue;
          }
          if (!nodeSet.has(child)) {
            const initialStates = getInitialStateNodesWithTheirAncestors(child);
            for (const initialStateNode of initialStates) {
              nodeSet.add(initialStateNode);
            }
          }
        }
      }
    }
  }
  for (const s of nodeSet) {
    let m = s.parent;
    while (m) {
      nodeSet.add(m);
      m = m.parent;
    }
  }
  return nodeSet;
}
function getValueFromAdj(baseNode, adjList) {
  const childStateNodes = adjList.get(baseNode);
  if (!childStateNodes) {
    return {};
  }
  if (baseNode.type === "compound") {
    const childStateNode = childStateNodes[0];
    if (childStateNode) {
      if (isAtomicStateNode(childStateNode)) {
        return childStateNode.key;
      }
    } else {
      return {};
    }
  }
  const stateValue = {};
  for (const childStateNode of childStateNodes) {
    stateValue[childStateNode.key] = getValueFromAdj(childStateNode, adjList);
  }
  return stateValue;
}
function getAdjList(stateNodes) {
  const adjList = /* @__PURE__ */ new Map();
  for (const s of stateNodes) {
    if (!adjList.has(s)) {
      adjList.set(s, []);
    }
    if (s.parent) {
      if (!adjList.has(s.parent)) {
        adjList.set(s.parent, []);
      }
      adjList.get(s.parent).push(s);
    }
  }
  return adjList;
}
function getStateValue(rootNode, stateNodes) {
  const config2 = getAllStateNodes(stateNodes);
  return getValueFromAdj(rootNode, getAdjList(config2));
}
function isInFinalState(stateNodeSet, stateNode) {
  if (stateNode.type === "compound") {
    return getChildren(stateNode).some((s) => s.type === "final" && stateNodeSet.has(s));
  }
  if (stateNode.type === "parallel") {
    return getChildren(stateNode).every((sn) => isInFinalState(stateNodeSet, sn));
  }
  return stateNode.type === "final";
}
const isStateId = (str) => str[0] === STATE_IDENTIFIER$1;
function getCandidates(stateNode, receivedEventType) {
  const candidates = stateNode.transitions.get(receivedEventType) || [...stateNode.transitions.keys()].filter((eventDescriptor) => {
    if (eventDescriptor === WILDCARD) {
      return true;
    }
    if (!eventDescriptor.endsWith(".*")) {
      return false;
    }
    const partialEventTokens = eventDescriptor.split(".");
    const eventTokens = receivedEventType.split(".");
    for (let tokenIndex = 0; tokenIndex < partialEventTokens.length; tokenIndex++) {
      const partialEventToken = partialEventTokens[tokenIndex];
      const eventToken = eventTokens[tokenIndex];
      if (partialEventToken === "*") {
        const isLastToken = tokenIndex === partialEventTokens.length - 1;
        return isLastToken;
      }
      if (partialEventToken !== eventToken) {
        return false;
      }
    }
    return true;
  }).sort((a, b) => b.length - a.length).flatMap((key) => stateNode.transitions.get(key));
  return candidates;
}
function getDelayedTransitions(stateNode) {
  const afterConfig = stateNode.config.after;
  if (!afterConfig) {
    return [];
  }
  const mutateEntryExit = (delay2, i) => {
    const afterEvent = createAfterEvent(delay2, stateNode.id);
    const eventType = afterEvent.type;
    stateNode.entry.push(raise(afterEvent, {
      id: eventType,
      delay: delay2
    }));
    stateNode.exit.push(cancel(eventType));
    return eventType;
  };
  const delayedTransitions = Object.keys(afterConfig).flatMap((delay2, i) => {
    const configTransition = afterConfig[delay2];
    const resolvedTransition = typeof configTransition === "string" ? {
      target: configTransition
    } : configTransition;
    const resolvedDelay = Number.isNaN(+delay2) ? delay2 : +delay2;
    const eventType = mutateEntryExit(resolvedDelay);
    return toArray$2(resolvedTransition).map((transition) => ({
      ...transition,
      event: eventType,
      delay: resolvedDelay
    }));
  });
  return delayedTransitions.map((delayedTransition) => {
    const {
      delay: delay2
    } = delayedTransition;
    return {
      ...formatTransition(stateNode, delayedTransition.event, delayedTransition),
      delay: delay2
    };
  });
}
function formatTransition(stateNode, descriptor, transitionConfig) {
  const normalizedTarget = normalizeTarget(transitionConfig.target);
  const reenter = transitionConfig.reenter ?? false;
  const target = resolveTarget(stateNode, normalizedTarget);
  const transition = {
    ...transitionConfig,
    actions: toArray$2(transitionConfig.actions),
    guard: transitionConfig.guard,
    target,
    source: stateNode,
    reenter,
    eventType: descriptor,
    toJSON: () => ({
      ...transition,
      source: `#${stateNode.id}`,
      target: target ? target.map((t) => `#${t.id}`) : void 0
    })
  };
  return transition;
}
function formatTransitions(stateNode) {
  const transitions = /* @__PURE__ */ new Map();
  if (stateNode.config.on) {
    for (const descriptor of Object.keys(stateNode.config.on)) {
      if (descriptor === NULL_EVENT) {
        throw new Error('Null events ("") cannot be specified as a transition key. Use `always: { ... }` instead.');
      }
      const transitionsConfig = stateNode.config.on[descriptor];
      transitions.set(descriptor, toTransitionConfigArray(transitionsConfig).map((t) => formatTransition(stateNode, descriptor, t)));
    }
  }
  if (stateNode.config.onDone) {
    const descriptor = `xstate.done.state.${stateNode.id}`;
    transitions.set(descriptor, toTransitionConfigArray(stateNode.config.onDone).map((t) => formatTransition(stateNode, descriptor, t)));
  }
  for (const invokeDef of stateNode.invoke) {
    if (invokeDef.onDone) {
      const descriptor = `xstate.done.actor.${invokeDef.id}`;
      transitions.set(descriptor, toTransitionConfigArray(invokeDef.onDone).map((t) => formatTransition(stateNode, descriptor, t)));
    }
    if (invokeDef.onError) {
      const descriptor = `xstate.error.actor.${invokeDef.id}`;
      transitions.set(descriptor, toTransitionConfigArray(invokeDef.onError).map((t) => formatTransition(stateNode, descriptor, t)));
    }
    if (invokeDef.onSnapshot) {
      const descriptor = `xstate.snapshot.${invokeDef.id}`;
      transitions.set(descriptor, toTransitionConfigArray(invokeDef.onSnapshot).map((t) => formatTransition(stateNode, descriptor, t)));
    }
  }
  for (const delayedTransition of stateNode.after) {
    let existing = transitions.get(delayedTransition.eventType);
    if (!existing) {
      existing = [];
      transitions.set(delayedTransition.eventType, existing);
    }
    existing.push(delayedTransition);
  }
  return transitions;
}
function formatInitialTransition(stateNode, _target) {
  const resolvedTarget = typeof _target === "string" ? stateNode.states[_target] : _target ? stateNode.states[_target.target] : void 0;
  if (!resolvedTarget && _target) {
    throw new Error(`Initial state node "${_target}" not found on parent state node #${stateNode.id}`);
  }
  const transition = {
    source: stateNode,
    actions: !_target || typeof _target === "string" ? [] : toArray$2(_target.actions),
    eventType: null,
    reenter: false,
    target: resolvedTarget ? [resolvedTarget] : [],
    toJSON: () => ({
      ...transition,
      source: `#${stateNode.id}`,
      target: resolvedTarget ? [`#${resolvedTarget.id}`] : []
    })
  };
  return transition;
}
function resolveTarget(stateNode, targets) {
  if (targets === void 0) {
    return void 0;
  }
  return targets.map((target) => {
    if (typeof target !== "string") {
      return target;
    }
    if (isStateId(target)) {
      return stateNode.machine.getStateNodeById(target);
    }
    const isInternalTarget = target[0] === STATE_DELIMITER;
    if (isInternalTarget && !stateNode.parent) {
      return getStateNodeByPath(stateNode, target.slice(1));
    }
    const resolvedTarget = isInternalTarget ? stateNode.key + target : target;
    if (stateNode.parent) {
      try {
        const targetStateNode = getStateNodeByPath(stateNode.parent, resolvedTarget);
        return targetStateNode;
      } catch (err) {
        throw new Error(`Invalid transition definition for state node '${stateNode.id}':
${err.message}`);
      }
    } else {
      throw new Error(`Invalid target: "${target}" is not a valid target from the root node. Did you mean ".${target}"?`);
    }
  });
}
function resolveHistoryDefaultTransition(stateNode) {
  const normalizedTarget = normalizeTarget(stateNode.config.target);
  if (!normalizedTarget) {
    return stateNode.parent.initial;
  }
  return {
    target: normalizedTarget.map((t) => typeof t === "string" ? getStateNodeByPath(stateNode.parent, t) : t)
  };
}
function isHistoryNode(stateNode) {
  return stateNode.type === "history";
}
function getInitialStateNodesWithTheirAncestors(stateNode) {
  const states = getInitialStateNodes(stateNode);
  for (const initialState of states) {
    for (const ancestor of getProperAncestors(initialState, stateNode)) {
      states.add(ancestor);
    }
  }
  return states;
}
function getInitialStateNodes(stateNode) {
  const set = /* @__PURE__ */ new Set();
  function iter(descStateNode) {
    if (set.has(descStateNode)) {
      return;
    }
    set.add(descStateNode);
    if (descStateNode.type === "compound") {
      iter(descStateNode.initial.target[0]);
    } else if (descStateNode.type === "parallel") {
      for (const child of getChildren(descStateNode)) {
        iter(child);
      }
    }
  }
  iter(stateNode);
  return set;
}
function getStateNode(stateNode, stateKey) {
  if (isStateId(stateKey)) {
    return stateNode.machine.getStateNodeById(stateKey);
  }
  if (!stateNode.states) {
    throw new Error(`Unable to retrieve child state '${stateKey}' from '${stateNode.id}'; no child states exist.`);
  }
  const result = stateNode.states[stateKey];
  if (!result) {
    throw new Error(`Child state '${stateKey}' does not exist on '${stateNode.id}'`);
  }
  return result;
}
function getStateNodeByPath(stateNode, statePath) {
  if (typeof statePath === "string" && isStateId(statePath)) {
    try {
      return stateNode.machine.getStateNodeById(statePath);
    } catch (e) {
    }
  }
  const arrayStatePath = toStatePath(statePath).slice();
  let currentStateNode = stateNode;
  while (arrayStatePath.length) {
    const key = arrayStatePath.shift();
    if (!key.length) {
      break;
    }
    currentStateNode = getStateNode(currentStateNode, key);
  }
  return currentStateNode;
}
function getStateNodes(stateNode, stateValue) {
  if (typeof stateValue === "string") {
    const childStateNode = stateNode.states[stateValue];
    if (!childStateNode) {
      throw new Error(`State '${stateValue}' does not exist on '${stateNode.id}'`);
    }
    return [stateNode, childStateNode];
  }
  const childStateKeys = Object.keys(stateValue);
  const childStateNodes = childStateKeys.map((subStateKey) => getStateNode(stateNode, subStateKey)).filter(Boolean);
  return [stateNode.machine.root, stateNode].concat(childStateNodes, childStateKeys.reduce((allSubStateNodes, subStateKey) => {
    const subStateNode = getStateNode(stateNode, subStateKey);
    if (!subStateNode) {
      return allSubStateNodes;
    }
    const subStateNodes = getStateNodes(subStateNode, stateValue[subStateKey]);
    return allSubStateNodes.concat(subStateNodes);
  }, []));
}
function transitionAtomicNode(stateNode, stateValue, snapshot, event) {
  const childStateNode = getStateNode(stateNode, stateValue);
  const next = childStateNode.next(snapshot, event);
  if (!next || !next.length) {
    return stateNode.next(snapshot, event);
  }
  return next;
}
function transitionCompoundNode(stateNode, stateValue, snapshot, event) {
  const subStateKeys = Object.keys(stateValue);
  const childStateNode = getStateNode(stateNode, subStateKeys[0]);
  const next = transitionNode(childStateNode, stateValue[subStateKeys[0]], snapshot, event);
  if (!next || !next.length) {
    return stateNode.next(snapshot, event);
  }
  return next;
}
function transitionParallelNode(stateNode, stateValue, snapshot, event) {
  const allInnerTransitions = [];
  for (const subStateKey of Object.keys(stateValue)) {
    const subStateValue = stateValue[subStateKey];
    if (!subStateValue) {
      continue;
    }
    const subStateNode = getStateNode(stateNode, subStateKey);
    const innerTransitions = transitionNode(subStateNode, subStateValue, snapshot, event);
    if (innerTransitions) {
      allInnerTransitions.push(...innerTransitions);
    }
  }
  if (!allInnerTransitions.length) {
    return stateNode.next(snapshot, event);
  }
  return allInnerTransitions;
}
function transitionNode(stateNode, stateValue, snapshot, event) {
  if (typeof stateValue === "string") {
    return transitionAtomicNode(stateNode, stateValue, snapshot, event);
  }
  if (Object.keys(stateValue).length === 1) {
    return transitionCompoundNode(stateNode, stateValue, snapshot, event);
  }
  return transitionParallelNode(stateNode, stateValue, snapshot, event);
}
function getHistoryNodes(stateNode) {
  return Object.keys(stateNode.states).map((key) => stateNode.states[key]).filter((sn) => sn.type === "history");
}
function isDescendant(childStateNode, parentStateNode) {
  let marker = childStateNode;
  while (marker.parent && marker.parent !== parentStateNode) {
    marker = marker.parent;
  }
  return marker.parent === parentStateNode;
}
function hasIntersection(s1, s2) {
  const set1 = new Set(s1);
  const set2 = new Set(s2);
  for (const item of set1) {
    if (set2.has(item)) {
      return true;
    }
  }
  for (const item of set2) {
    if (set1.has(item)) {
      return true;
    }
  }
  return false;
}
function removeConflictingTransitions(enabledTransitions, stateNodeSet, historyValue) {
  const filteredTransitions = /* @__PURE__ */ new Set();
  for (const t1 of enabledTransitions) {
    let t1Preempted = false;
    const transitionsToRemove = /* @__PURE__ */ new Set();
    for (const t2 of filteredTransitions) {
      if (hasIntersection(computeExitSet([t1], stateNodeSet, historyValue), computeExitSet([t2], stateNodeSet, historyValue))) {
        if (isDescendant(t1.source, t2.source)) {
          transitionsToRemove.add(t2);
        } else {
          t1Preempted = true;
          break;
        }
      }
    }
    if (!t1Preempted) {
      for (const t3 of transitionsToRemove) {
        filteredTransitions.delete(t3);
      }
      filteredTransitions.add(t1);
    }
  }
  return Array.from(filteredTransitions);
}
function findLeastCommonAncestor(stateNodes) {
  const [head, ...tail] = stateNodes;
  for (const ancestor of getProperAncestors(head, void 0)) {
    if (tail.every((sn) => isDescendant(sn, ancestor))) {
      return ancestor;
    }
  }
}
function getEffectiveTargetStates(transition, historyValue) {
  if (!transition.target) {
    return [];
  }
  const targets = /* @__PURE__ */ new Set();
  for (const targetNode of transition.target) {
    if (isHistoryNode(targetNode)) {
      if (historyValue[targetNode.id]) {
        for (const node of historyValue[targetNode.id]) {
          targets.add(node);
        }
      } else {
        for (const node of getEffectiveTargetStates(resolveHistoryDefaultTransition(targetNode), historyValue)) {
          targets.add(node);
        }
      }
    } else {
      targets.add(targetNode);
    }
  }
  return [...targets];
}
function getTransitionDomain(transition, historyValue) {
  const targetStates = getEffectiveTargetStates(transition, historyValue);
  if (!targetStates) {
    return;
  }
  if (!transition.reenter && targetStates.every((target) => target === transition.source || isDescendant(target, transition.source))) {
    return transition.source;
  }
  const lca = findLeastCommonAncestor(targetStates.concat(transition.source));
  if (lca) {
    return lca;
  }
  if (transition.reenter) {
    return;
  }
  return transition.source.machine.root;
}
function computeExitSet(transitions, stateNodeSet, historyValue) {
  const statesToExit = /* @__PURE__ */ new Set();
  for (const t of transitions) {
    if (t.target?.length) {
      const domain = getTransitionDomain(t, historyValue);
      if (t.reenter && t.source === domain) {
        statesToExit.add(domain);
      }
      for (const stateNode of stateNodeSet) {
        if (isDescendant(stateNode, domain)) {
          statesToExit.add(stateNode);
        }
      }
    }
  }
  return [...statesToExit];
}
function areStateNodeCollectionsEqual(prevStateNodes, nextStateNodeSet) {
  if (prevStateNodes.length !== nextStateNodeSet.size) {
    return false;
  }
  for (const node of prevStateNodes) {
    if (!nextStateNodeSet.has(node)) {
      return false;
    }
  }
  return true;
}
function microstep(transitions, currentSnapshot, actorScope, event, isInitial, internalQueue) {
  if (!transitions.length) {
    return currentSnapshot;
  }
  const mutStateNodeSet = new Set(currentSnapshot._nodes);
  let historyValue = currentSnapshot.historyValue;
  const filteredTransitions = removeConflictingTransitions(transitions, mutStateNodeSet, historyValue);
  let nextState = currentSnapshot;
  if (!isInitial) {
    [nextState, historyValue] = exitStates(nextState, event, actorScope, filteredTransitions, mutStateNodeSet, historyValue, internalQueue);
  }
  nextState = resolveActionsAndContext(nextState, event, actorScope, filteredTransitions.flatMap((t) => t.actions), internalQueue);
  nextState = enterStates(nextState, event, actorScope, filteredTransitions, mutStateNodeSet, internalQueue, historyValue, isInitial);
  const nextStateNodes = [...mutStateNodeSet];
  if (nextState.status === "done") {
    nextState = resolveActionsAndContext(nextState, event, actorScope, nextStateNodes.sort((a, b) => b.order - a.order).flatMap((state) => state.exit), internalQueue);
  }
  try {
    if (historyValue === currentSnapshot.historyValue && areStateNodeCollectionsEqual(currentSnapshot._nodes, mutStateNodeSet)) {
      return nextState;
    }
    return cloneMachineSnapshot(nextState, {
      _nodes: nextStateNodes,
      historyValue
    });
  } catch (e) {
    throw e;
  }
}
function getMachineOutput(snapshot, event, actorScope, rootNode, rootCompletionNode) {
  if (rootNode.output === void 0) {
    return;
  }
  const doneStateEvent = createDoneStateEvent(rootCompletionNode.id, rootCompletionNode.output !== void 0 && rootCompletionNode.parent ? resolveOutput(rootCompletionNode.output, snapshot.context, event, actorScope.self) : void 0);
  return resolveOutput(rootNode.output, snapshot.context, doneStateEvent, actorScope.self);
}
function enterStates(currentSnapshot, event, actorScope, filteredTransitions, mutStateNodeSet, internalQueue, historyValue, isInitial) {
  let nextSnapshot = currentSnapshot;
  const statesToEnter = /* @__PURE__ */ new Set();
  const statesForDefaultEntry = /* @__PURE__ */ new Set();
  computeEntrySet(filteredTransitions, historyValue, statesForDefaultEntry, statesToEnter);
  if (isInitial) {
    statesForDefaultEntry.add(currentSnapshot.machine.root);
  }
  const completedNodes = /* @__PURE__ */ new Set();
  for (const stateNodeToEnter of [...statesToEnter].sort((a, b) => a.order - b.order)) {
    mutStateNodeSet.add(stateNodeToEnter);
    const actions = [];
    actions.push(...stateNodeToEnter.entry);
    for (const invokeDef of stateNodeToEnter.invoke) {
      actions.push(spawnChild(invokeDef.src, {
        ...invokeDef,
        syncSnapshot: !!invokeDef.onSnapshot
      }));
    }
    if (statesForDefaultEntry.has(stateNodeToEnter)) {
      const initialActions = stateNodeToEnter.initial.actions;
      actions.push(...initialActions);
    }
    nextSnapshot = resolveActionsAndContext(nextSnapshot, event, actorScope, actions, internalQueue, stateNodeToEnter.invoke.map((invokeDef) => invokeDef.id));
    if (stateNodeToEnter.type === "final") {
      const parent = stateNodeToEnter.parent;
      let ancestorMarker = parent?.type === "parallel" ? parent : parent?.parent;
      let rootCompletionNode = ancestorMarker || stateNodeToEnter;
      if (parent?.type === "compound") {
        internalQueue.push(createDoneStateEvent(parent.id, stateNodeToEnter.output !== void 0 ? resolveOutput(stateNodeToEnter.output, nextSnapshot.context, event, actorScope.self) : void 0));
      }
      while (ancestorMarker?.type === "parallel" && !completedNodes.has(ancestorMarker) && isInFinalState(mutStateNodeSet, ancestorMarker)) {
        completedNodes.add(ancestorMarker);
        internalQueue.push(createDoneStateEvent(ancestorMarker.id));
        rootCompletionNode = ancestorMarker;
        ancestorMarker = ancestorMarker.parent;
      }
      if (ancestorMarker) {
        continue;
      }
      nextSnapshot = cloneMachineSnapshot(nextSnapshot, {
        status: "done",
        output: getMachineOutput(nextSnapshot, event, actorScope, nextSnapshot.machine.root, rootCompletionNode)
      });
    }
  }
  return nextSnapshot;
}
function computeEntrySet(transitions, historyValue, statesForDefaultEntry, statesToEnter) {
  for (const t of transitions) {
    const domain = getTransitionDomain(t, historyValue);
    for (const s of t.target || []) {
      if (!isHistoryNode(s) && // if the target is different than the source then it will *definitely* be entered
      (t.source !== s || // we know that the domain can't lie within the source
      // if it's different than the source then it's outside of it and it means that the target has to be entered as well
      t.source !== domain || // reentering transitions always enter the target, even if it's the source itself
      t.reenter)) {
        statesToEnter.add(s);
        statesForDefaultEntry.add(s);
      }
      addDescendantStatesToEnter(s, historyValue, statesForDefaultEntry, statesToEnter);
    }
    const targetStates = getEffectiveTargetStates(t, historyValue);
    for (const s of targetStates) {
      const ancestors = getProperAncestors(s, domain);
      if (domain?.type === "parallel") {
        ancestors.push(domain);
      }
      addAncestorStatesToEnter(statesToEnter, historyValue, statesForDefaultEntry, ancestors, !t.source.parent && t.reenter ? void 0 : domain);
    }
  }
}
function addDescendantStatesToEnter(stateNode, historyValue, statesForDefaultEntry, statesToEnter) {
  if (isHistoryNode(stateNode)) {
    if (historyValue[stateNode.id]) {
      const historyStateNodes = historyValue[stateNode.id];
      for (const s of historyStateNodes) {
        statesToEnter.add(s);
        addDescendantStatesToEnter(s, historyValue, statesForDefaultEntry, statesToEnter);
      }
      for (const s of historyStateNodes) {
        addProperAncestorStatesToEnter(s, stateNode.parent, statesToEnter, historyValue, statesForDefaultEntry);
      }
    } else {
      const historyDefaultTransition = resolveHistoryDefaultTransition(stateNode);
      for (const s of historyDefaultTransition.target) {
        statesToEnter.add(s);
        if (historyDefaultTransition === stateNode.parent?.initial) {
          statesForDefaultEntry.add(stateNode.parent);
        }
        addDescendantStatesToEnter(s, historyValue, statesForDefaultEntry, statesToEnter);
      }
      for (const s of historyDefaultTransition.target) {
        addProperAncestorStatesToEnter(s, stateNode.parent, statesToEnter, historyValue, statesForDefaultEntry);
      }
    }
  } else {
    if (stateNode.type === "compound") {
      const [initialState] = stateNode.initial.target;
      if (!isHistoryNode(initialState)) {
        statesToEnter.add(initialState);
        statesForDefaultEntry.add(initialState);
      }
      addDescendantStatesToEnter(initialState, historyValue, statesForDefaultEntry, statesToEnter);
      addProperAncestorStatesToEnter(initialState, stateNode, statesToEnter, historyValue, statesForDefaultEntry);
    } else {
      if (stateNode.type === "parallel") {
        for (const child of getChildren(stateNode).filter((sn) => !isHistoryNode(sn))) {
          if (![...statesToEnter].some((s) => isDescendant(s, child))) {
            if (!isHistoryNode(child)) {
              statesToEnter.add(child);
              statesForDefaultEntry.add(child);
            }
            addDescendantStatesToEnter(child, historyValue, statesForDefaultEntry, statesToEnter);
          }
        }
      }
    }
  }
}
function addAncestorStatesToEnter(statesToEnter, historyValue, statesForDefaultEntry, ancestors, reentrancyDomain) {
  for (const anc of ancestors) {
    if (!reentrancyDomain || isDescendant(anc, reentrancyDomain)) {
      statesToEnter.add(anc);
    }
    if (anc.type === "parallel") {
      for (const child of getChildren(anc).filter((sn) => !isHistoryNode(sn))) {
        if (![...statesToEnter].some((s) => isDescendant(s, child))) {
          statesToEnter.add(child);
          addDescendantStatesToEnter(child, historyValue, statesForDefaultEntry, statesToEnter);
        }
      }
    }
  }
}
function addProperAncestorStatesToEnter(stateNode, toStateNode, statesToEnter, historyValue, statesForDefaultEntry) {
  addAncestorStatesToEnter(statesToEnter, historyValue, statesForDefaultEntry, getProperAncestors(stateNode, toStateNode));
}
function exitStates(currentSnapshot, event, actorScope, transitions, mutStateNodeSet, historyValue, internalQueue) {
  let nextSnapshot = currentSnapshot;
  const statesToExit = computeExitSet(transitions, mutStateNodeSet, historyValue);
  statesToExit.sort((a, b) => b.order - a.order);
  let changedHistory;
  for (const exitStateNode of statesToExit) {
    for (const historyNode of getHistoryNodes(exitStateNode)) {
      let predicate;
      if (historyNode.history === "deep") {
        predicate = (sn) => isAtomicStateNode(sn) && isDescendant(sn, exitStateNode);
      } else {
        predicate = (sn) => {
          return sn.parent === exitStateNode;
        };
      }
      changedHistory ??= {
        ...historyValue
      };
      changedHistory[historyNode.id] = Array.from(mutStateNodeSet).filter(predicate);
    }
  }
  for (const s of statesToExit) {
    nextSnapshot = resolveActionsAndContext(nextSnapshot, event, actorScope, [...s.exit, ...s.invoke.map((def) => stopChild(def.id))], internalQueue);
    mutStateNodeSet.delete(s);
  }
  return [nextSnapshot, changedHistory || historyValue];
}
let executingCustomAction = false;
function resolveAndExecuteActionsWithContext(currentSnapshot, event, actorScope, actions, extra, retries) {
  const {
    machine
  } = currentSnapshot;
  let intermediateSnapshot = currentSnapshot;
  for (const action of actions) {
    let executeAction = function() {
      actorScope.system._sendInspectionEvent({
        type: "@xstate.action",
        actorRef: actorScope.self,
        action: {
          type: typeof action === "string" ? action : typeof action === "object" ? action.type : action.name || "(anonymous)",
          params: actionParams
        }
      });
      try {
        executingCustomAction = resolvedAction;
        resolvedAction(actionArgs, actionParams);
      } finally {
        executingCustomAction = false;
      }
    };
    const isInline = typeof action === "function";
    const resolvedAction = isInline ? action : (
      // the existing type of `.actions` assumes non-nullable `TExpressionAction`
      // it's fine to cast this here to get a common type and lack of errors in the rest of the code
      // our logic below makes sure that we call those 2 "variants" correctly
      machine.implementations.actions[typeof action === "string" ? action : action.type]
    );
    if (!resolvedAction) {
      continue;
    }
    const actionArgs = {
      context: intermediateSnapshot.context,
      event,
      self: actorScope.self,
      system: actorScope.system
    };
    const actionParams = isInline || typeof action === "string" ? void 0 : "params" in action ? typeof action.params === "function" ? action.params({
      context: intermediateSnapshot.context,
      event
    }) : action.params : void 0;
    if (!("resolve" in resolvedAction)) {
      if (actorScope.self._processingStatus === ProcessingStatus.Running) {
        executeAction();
      } else {
        actorScope.defer(() => {
          executeAction();
        });
      }
      continue;
    }
    const builtinAction = resolvedAction;
    const [nextState, params, actions2] = builtinAction.resolve(
      actorScope,
      intermediateSnapshot,
      actionArgs,
      actionParams,
      resolvedAction,
      // this holds all params
      extra
    );
    intermediateSnapshot = nextState;
    if ("retryResolve" in builtinAction) {
      retries?.push([builtinAction, params]);
    }
    if ("execute" in builtinAction) {
      if (actorScope.self._processingStatus === ProcessingStatus.Running) {
        builtinAction.execute(actorScope, params);
      } else {
        actorScope.defer(builtinAction.execute.bind(null, actorScope, params));
      }
    }
    if (actions2) {
      intermediateSnapshot = resolveAndExecuteActionsWithContext(intermediateSnapshot, event, actorScope, actions2, extra, retries);
    }
  }
  return intermediateSnapshot;
}
function resolveActionsAndContext(currentSnapshot, event, actorScope, actions, internalQueue, deferredActorIds) {
  const retries = deferredActorIds ? [] : void 0;
  const nextState = resolveAndExecuteActionsWithContext(currentSnapshot, event, actorScope, actions, {
    internalQueue,
    deferredActorIds
  }, retries);
  retries?.forEach(([builtinAction, params]) => {
    builtinAction.retryResolve(actorScope, nextState, params);
  });
  return nextState;
}
function macrostep(snapshot, event, actorScope, internalQueue = []) {
  let nextSnapshot = snapshot;
  const microstates = [];
  function addMicrostate(microstate, event2, transitions) {
    actorScope.system._sendInspectionEvent({
      type: "@xstate.microstep",
      actorRef: actorScope.self,
      event: event2,
      snapshot: microstate,
      _transitions: transitions
    });
    microstates.push(microstate);
  }
  if (event.type === XSTATE_STOP) {
    nextSnapshot = cloneMachineSnapshot(stopChildren(nextSnapshot, event, actorScope), {
      status: "stopped"
    });
    addMicrostate(nextSnapshot, event, []);
    return {
      snapshot: nextSnapshot,
      microstates
    };
  }
  let nextEvent = event;
  if (nextEvent.type !== XSTATE_INIT) {
    const currentEvent = nextEvent;
    const isErr = isErrorActorEvent(currentEvent);
    const transitions = selectTransitions(currentEvent, nextSnapshot);
    if (isErr && !transitions.length) {
      nextSnapshot = cloneMachineSnapshot(snapshot, {
        status: "error",
        error: currentEvent.error
      });
      addMicrostate(nextSnapshot, currentEvent, []);
      return {
        snapshot: nextSnapshot,
        microstates
      };
    }
    nextSnapshot = microstep(
      transitions,
      snapshot,
      actorScope,
      nextEvent,
      false,
      // isInitial
      internalQueue
    );
    addMicrostate(nextSnapshot, currentEvent, transitions);
  }
  let shouldSelectEventlessTransitions = true;
  while (nextSnapshot.status === "active") {
    let enabledTransitions = shouldSelectEventlessTransitions ? selectEventlessTransitions(nextSnapshot, nextEvent) : [];
    const previousState = enabledTransitions.length ? nextSnapshot : void 0;
    if (!enabledTransitions.length) {
      if (!internalQueue.length) {
        break;
      }
      nextEvent = internalQueue.shift();
      enabledTransitions = selectTransitions(nextEvent, nextSnapshot);
    }
    nextSnapshot = microstep(enabledTransitions, nextSnapshot, actorScope, nextEvent, false, internalQueue);
    shouldSelectEventlessTransitions = nextSnapshot !== previousState;
    addMicrostate(nextSnapshot, nextEvent, enabledTransitions);
  }
  if (nextSnapshot.status !== "active") {
    stopChildren(nextSnapshot, nextEvent, actorScope);
  }
  return {
    snapshot: nextSnapshot,
    microstates
  };
}
function stopChildren(nextState, event, actorScope) {
  return resolveActionsAndContext(nextState, event, actorScope, Object.values(nextState.children).map((child) => stopChild(child)), []);
}
function selectTransitions(event, nextState) {
  return nextState.machine.getTransitionData(nextState, event);
}
function selectEventlessTransitions(nextState, event) {
  const enabledTransitionSet = /* @__PURE__ */ new Set();
  const atomicStates = nextState._nodes.filter(isAtomicStateNode);
  for (const stateNode of atomicStates) {
    loop: for (const s of [stateNode].concat(getProperAncestors(stateNode, void 0))) {
      if (!s.always) {
        continue;
      }
      for (const transition of s.always) {
        if (transition.guard === void 0 || evaluateGuard(transition.guard, nextState.context, event, nextState)) {
          enabledTransitionSet.add(transition);
          break loop;
        }
      }
    }
  }
  return removeConflictingTransitions(Array.from(enabledTransitionSet), new Set(nextState._nodes), nextState.historyValue);
}
function resolveStateValue(rootNode, stateValue) {
  const allStateNodes = getAllStateNodes(getStateNodes(rootNode, stateValue));
  return getStateValue(rootNode, [...allStateNodes]);
}
function isMachineSnapshot(value) {
  return !!value && typeof value === "object" && "machine" in value && "value" in value;
}
const machineSnapshotMatches = function matches(testValue) {
  return matchesState(testValue, this.value);
};
const machineSnapshotHasTag = function hasTag(tag) {
  return this.tags.has(tag);
};
const machineSnapshotCan = function can(event) {
  const transitionData = this.machine.getTransitionData(this, event);
  return !!transitionData?.length && // Check that at least one transition is not forbidden
  transitionData.some((t) => t.target !== void 0 || t.actions.length);
};
const machineSnapshotToJSON = function toJSON() {
  const {
    _nodes: nodes,
    tags,
    machine,
    getMeta: getMeta2,
    toJSON: toJSON2,
    can: can2,
    hasTag: hasTag2,
    matches: matches2,
    ...jsonValues
  } = this;
  return {
    ...jsonValues,
    tags: Array.from(tags)
  };
};
const machineSnapshotGetMeta = function getMeta() {
  return this._nodes.reduce((acc, stateNode) => {
    if (stateNode.meta !== void 0) {
      acc[stateNode.id] = stateNode.meta;
    }
    return acc;
  }, {});
};
function createMachineSnapshot(config2, machine) {
  return {
    status: config2.status,
    output: config2.output,
    error: config2.error,
    machine,
    context: config2.context,
    _nodes: config2._nodes,
    value: getStateValue(machine.root, config2._nodes),
    tags: new Set(config2._nodes.flatMap((sn) => sn.tags)),
    children: config2.children,
    historyValue: config2.historyValue || {},
    matches: machineSnapshotMatches,
    hasTag: machineSnapshotHasTag,
    can: machineSnapshotCan,
    getMeta: machineSnapshotGetMeta,
    toJSON: machineSnapshotToJSON
  };
}
function cloneMachineSnapshot(snapshot, config2 = {}) {
  return createMachineSnapshot({
    ...snapshot,
    ...config2
  }, snapshot.machine);
}
function getPersistedSnapshot(snapshot, options) {
  const {
    _nodes: nodes,
    tags,
    machine,
    children,
    context: context2,
    can: can2,
    hasTag: hasTag2,
    matches: matches2,
    getMeta: getMeta2,
    toJSON: toJSON2,
    ...jsonValues
  } = snapshot;
  const childrenJson = {};
  for (const id in children) {
    const child = children[id];
    childrenJson[id] = {
      snapshot: child.getPersistedSnapshot(options),
      src: child.src,
      systemId: child._systemId,
      syncSnapshot: child._syncSnapshot
    };
  }
  const persisted = {
    ...jsonValues,
    context: persistContext(context2),
    children: childrenJson
  };
  return persisted;
}
function persistContext(contextPart) {
  let copy;
  for (const key in contextPart) {
    const value = contextPart[key];
    if (value && typeof value === "object") {
      if ("sessionId" in value && "send" in value && "ref" in value) {
        copy ??= Array.isArray(contextPart) ? contextPart.slice() : {
          ...contextPart
        };
        copy[key] = {
          xstate$$type: $$ACTOR_TYPE,
          id: value.id
        };
      } else {
        const result = persistContext(value);
        if (result !== value) {
          copy ??= Array.isArray(contextPart) ? contextPart.slice() : {
            ...contextPart
          };
          copy[key] = result;
        }
      }
    }
  }
  return copy ?? contextPart;
}
function resolveRaise(_, snapshot, args2, actionParams, {
  event: eventOrExpr,
  id,
  delay: delay2
}, {
  internalQueue
}) {
  const delaysMap = snapshot.machine.implementations.delays;
  if (typeof eventOrExpr === "string") {
    throw new Error(`Only event objects may be used with raise; use raise({ type: "${eventOrExpr}" }) instead`);
  }
  const resolvedEvent = typeof eventOrExpr === "function" ? eventOrExpr(args2, actionParams) : eventOrExpr;
  let resolvedDelay;
  if (typeof delay2 === "string") {
    const configDelay = delaysMap && delaysMap[delay2];
    resolvedDelay = typeof configDelay === "function" ? configDelay(args2, actionParams) : configDelay;
  } else {
    resolvedDelay = typeof delay2 === "function" ? delay2(args2, actionParams) : delay2;
  }
  if (typeof resolvedDelay !== "number") {
    internalQueue.push(resolvedEvent);
  }
  return [snapshot, {
    event: resolvedEvent,
    id,
    delay: resolvedDelay
  }];
}
function executeRaise(actorScope, params) {
  const {
    event,
    delay: delay2,
    id
  } = params;
  if (typeof delay2 === "number") {
    actorScope.defer(() => {
      const self2 = actorScope.self;
      actorScope.system.scheduler.schedule(self2, self2, event, delay2, id);
    });
    return;
  }
}
function raise(eventOrExpr, options) {
  function raise2(args2, params) {
  }
  raise2.type = "xstate.raise";
  raise2.event = eventOrExpr;
  raise2.id = options?.id;
  raise2.delay = options?.delay;
  raise2.resolve = resolveRaise;
  raise2.execute = executeRaise;
  return raise2;
}
const XSTATE_OBSERVABLE_ERROR = "xstate.observable.error";
const XSTATE_OBSERVABLE_COMPLETE = "xstate.observable.complete";
function fromEventObservable(lazyObservable) {
  const logic = {
    config: lazyObservable,
    transition: (state, event) => {
      if (state.status !== "active") {
        return state;
      }
      switch (event.type) {
        case XSTATE_OBSERVABLE_ERROR:
          return {
            ...state,
            status: "error",
            error: event.data,
            input: void 0,
            _subscription: void 0
          };
        case XSTATE_OBSERVABLE_COMPLETE:
          return {
            ...state,
            status: "done",
            input: void 0,
            _subscription: void 0
          };
        case XSTATE_STOP:
          state._subscription.unsubscribe();
          return {
            ...state,
            status: "stopped",
            input: void 0,
            _subscription: void 0
          };
        default:
          return state;
      }
    },
    getInitialSnapshot: (_, input) => {
      return {
        status: "active",
        output: void 0,
        error: void 0,
        context: void 0,
        input,
        _subscription: void 0
      };
    },
    start: (state, {
      self: self2,
      system,
      emit: emit2
    }) => {
      if (state.status === "done") {
        return;
      }
      state._subscription = lazyObservable({
        input: state.input,
        system,
        self: self2,
        emit: emit2
      }).subscribe({
        next: (value) => {
          if (self2._parent) {
            system._relay(self2, self2._parent, value);
          }
        },
        error: (err) => {
          system._relay(self2, self2, {
            type: XSTATE_OBSERVABLE_ERROR,
            data: err
          });
        },
        complete: () => {
          system._relay(self2, self2, {
            type: XSTATE_OBSERVABLE_COMPLETE
          });
        }
      });
    },
    getPersistedSnapshot: ({
      _subscription,
      ...snapshot
    }) => snapshot,
    restoreSnapshot: (snapshot) => ({
      ...snapshot,
      _subscription: void 0
    })
  };
  return logic;
}
function createSpawner(actorScope, {
  machine,
  context: context2
}, event, spawnedChildren) {
  const spawn = (src, options = {}) => {
    const {
      systemId,
      input
    } = options;
    if (typeof src === "string") {
      const logic = resolveReferencedActor(machine, src);
      if (!logic) {
        throw new Error(`Actor logic '${src}' not implemented in machine '${machine.id}'`);
      }
      const actorRef = createActor(logic, {
        id: options.id,
        parent: actorScope.self,
        syncSnapshot: options.syncSnapshot,
        input: typeof input === "function" ? input({
          context: context2,
          event,
          self: actorScope.self
        }) : input,
        src,
        systemId
      });
      spawnedChildren[actorRef.id] = actorRef;
      return actorRef;
    } else {
      const actorRef = createActor(src, {
        id: options.id,
        parent: actorScope.self,
        syncSnapshot: options.syncSnapshot,
        input: options.input,
        src,
        systemId
      });
      return actorRef;
    }
  };
  return (src, options) => {
    const actorRef = spawn(src, options);
    spawnedChildren[actorRef.id] = actorRef;
    actorScope.defer(() => {
      if (actorRef._processingStatus === ProcessingStatus.Stopped) {
        return;
      }
      actorRef.start();
    });
    return actorRef;
  };
}
function resolveAssign(actorScope, snapshot, actionArgs, actionParams, {
  assignment
}) {
  if (!snapshot.context) {
    throw new Error("Cannot assign to undefined `context`. Ensure that `context` is defined in the machine config.");
  }
  const spawnedChildren = {};
  const assignArgs = {
    context: snapshot.context,
    event: actionArgs.event,
    spawn: createSpawner(actorScope, snapshot, actionArgs.event, spawnedChildren),
    self: actorScope.self,
    system: actorScope.system
  };
  let partialUpdate = {};
  if (typeof assignment === "function") {
    partialUpdate = assignment(assignArgs, actionParams);
  } else {
    for (const key of Object.keys(assignment)) {
      const propAssignment = assignment[key];
      partialUpdate[key] = typeof propAssignment === "function" ? propAssignment(assignArgs, actionParams) : propAssignment;
    }
  }
  const updatedContext = Object.assign({}, snapshot.context, partialUpdate);
  return [cloneMachineSnapshot(snapshot, {
    context: updatedContext,
    children: Object.keys(spawnedChildren).length ? {
      ...snapshot.children,
      ...spawnedChildren
    } : snapshot.children
  })];
}
function assign(assignment) {
  function assign2(args2, params) {
  }
  assign2.type = "xstate.assign";
  assign2.assignment = assignment;
  assign2.resolve = resolveAssign;
  return assign2;
}
function resolveEmit(_, snapshot, args2, actionParams, {
  event: eventOrExpr
}) {
  const resolvedEvent = typeof eventOrExpr === "function" ? eventOrExpr(args2, actionParams) : eventOrExpr;
  return [snapshot, {
    event: resolvedEvent
  }];
}
function executeEmit(actorScope, {
  event
}) {
  actorScope.defer(() => actorScope.emit(event));
}
function emit(eventOrExpr) {
  function emit2(args2, params) {
  }
  emit2.type = "xstate.emit";
  emit2.event = eventOrExpr;
  emit2.resolve = resolveEmit;
  emit2.execute = executeEmit;
  return emit2;
}
let SpecialTargets = /* @__PURE__ */ function(SpecialTargets2) {
  SpecialTargets2["Parent"] = "#_parent";
  SpecialTargets2["Internal"] = "#_internal";
  return SpecialTargets2;
}({});
function resolveSendTo(actorScope, snapshot, args2, actionParams, {
  to,
  event: eventOrExpr,
  id,
  delay: delay2
}, extra) {
  const delaysMap = snapshot.machine.implementations.delays;
  if (typeof eventOrExpr === "string") {
    throw new Error(`Only event objects may be used with sendTo; use sendTo({ type: "${eventOrExpr}" }) instead`);
  }
  const resolvedEvent = typeof eventOrExpr === "function" ? eventOrExpr(args2, actionParams) : eventOrExpr;
  let resolvedDelay;
  if (typeof delay2 === "string") {
    const configDelay = delaysMap && delaysMap[delay2];
    resolvedDelay = typeof configDelay === "function" ? configDelay(args2, actionParams) : configDelay;
  } else {
    resolvedDelay = typeof delay2 === "function" ? delay2(args2, actionParams) : delay2;
  }
  const resolvedTarget = typeof to === "function" ? to(args2, actionParams) : to;
  let targetActorRef;
  if (typeof resolvedTarget === "string") {
    if (resolvedTarget === SpecialTargets.Parent) {
      targetActorRef = actorScope.self._parent;
    } else if (resolvedTarget === SpecialTargets.Internal) {
      targetActorRef = actorScope.self;
    } else if (resolvedTarget.startsWith("#_")) {
      targetActorRef = snapshot.children[resolvedTarget.slice(2)];
    } else {
      targetActorRef = extra.deferredActorIds?.includes(resolvedTarget) ? resolvedTarget : snapshot.children[resolvedTarget];
    }
    if (!targetActorRef) {
      throw new Error(`Unable to send event to actor '${resolvedTarget}' from machine '${snapshot.machine.id}'.`);
    }
  } else {
    targetActorRef = resolvedTarget || actorScope.self;
  }
  return [snapshot, {
    to: targetActorRef,
    event: resolvedEvent,
    id,
    delay: resolvedDelay
  }];
}
function retryResolveSendTo(_, snapshot, params) {
  if (typeof params.to === "string") {
    params.to = snapshot.children[params.to];
  }
}
function executeSendTo(actorScope, params) {
  actorScope.defer(() => {
    const {
      to,
      event,
      delay: delay2,
      id
    } = params;
    if (typeof delay2 === "number") {
      actorScope.system.scheduler.schedule(actorScope.self, to, event, delay2, id);
      return;
    }
    actorScope.system._relay(
      actorScope.self,
      // at this point, in a deferred task, it should already be mutated by retryResolveSendTo
      // if it initially started as a string
      to,
      event.type === XSTATE_ERROR ? createErrorActorEvent(actorScope.self.id, event.data) : event
    );
  });
}
function sendTo(to, eventOrExpr, options) {
  function sendTo2(args2, params) {
  }
  sendTo2.type = "xsnapshot.sendTo";
  sendTo2.to = to;
  sendTo2.event = eventOrExpr;
  sendTo2.id = options?.id;
  sendTo2.delay = options?.delay;
  sendTo2.resolve = resolveSendTo;
  sendTo2.retryResolve = retryResolveSendTo;
  sendTo2.execute = executeSendTo;
  return sendTo2;
}
function sendParent(event, options) {
  return sendTo(SpecialTargets.Parent, event, options);
}
function resolveEnqueueActions(actorScope, snapshot, args2, actionParams, {
  collect
}) {
  const actions = [];
  const enqueue = function enqueue2(action) {
    actions.push(action);
  };
  enqueue.assign = (...args3) => {
    actions.push(assign(...args3));
  };
  enqueue.cancel = (...args3) => {
    actions.push(cancel(...args3));
  };
  enqueue.raise = (...args3) => {
    actions.push(raise(...args3));
  };
  enqueue.sendTo = (...args3) => {
    actions.push(sendTo(...args3));
  };
  enqueue.sendParent = (...args3) => {
    actions.push(sendParent(...args3));
  };
  enqueue.spawnChild = (...args3) => {
    actions.push(spawnChild(...args3));
  };
  enqueue.stopChild = (...args3) => {
    actions.push(stopChild(...args3));
  };
  enqueue.emit = (...args3) => {
    actions.push(emit(...args3));
  };
  collect({
    context: args2.context,
    event: args2.event,
    enqueue,
    check: (guard) => evaluateGuard(guard, snapshot.context, args2.event, snapshot),
    self: actorScope.self,
    system: actorScope.system
  }, actionParams);
  return [snapshot, void 0, actions];
}
function enqueueActions(collect) {
  function enqueueActions2(args2, params) {
  }
  enqueueActions2.type = "xstate.enqueueActions";
  enqueueActions2.collect = collect;
  enqueueActions2.resolve = resolveEnqueueActions;
  return enqueueActions2;
}
function assertEvent(event, type) {
  const types2 = toArray$2(type);
  if (!types2.includes(event.type)) {
    const typesText = types2.length === 1 ? `type "${types2[0]}"` : `one of types "${types2.join('", "')}"`;
    throw new Error(`Expected event ${JSON.stringify(event)} to have ${typesText}`);
  }
}
const cache = /* @__PURE__ */ new WeakMap();
function memo(object, key, fn) {
  let memoizedData = cache.get(object);
  if (!memoizedData) {
    memoizedData = {
      [key]: fn()
    };
    cache.set(object, memoizedData);
  } else if (!(key in memoizedData)) {
    memoizedData[key] = fn();
  }
  return memoizedData[key];
}
const EMPTY_OBJECT = {};
const toSerializableAction = (action) => {
  if (typeof action === "string") {
    return {
      type: action
    };
  }
  if (typeof action === "function") {
    if ("resolve" in action) {
      return {
        type: action.type
      };
    }
    return {
      type: action.name
    };
  }
  return action;
};
class StateNode {
  constructor(config2, options) {
    this.config = config2;
    this.key = void 0;
    this.id = void 0;
    this.type = void 0;
    this.path = void 0;
    this.states = void 0;
    this.history = void 0;
    this.entry = void 0;
    this.exit = void 0;
    this.parent = void 0;
    this.machine = void 0;
    this.meta = void 0;
    this.output = void 0;
    this.order = -1;
    this.description = void 0;
    this.tags = [];
    this.transitions = void 0;
    this.always = void 0;
    this.parent = options._parent;
    this.key = options._key;
    this.machine = options._machine;
    this.path = this.parent ? this.parent.path.concat(this.key) : [];
    this.id = this.config.id || [this.machine.id, ...this.path].join(STATE_DELIMITER);
    this.type = this.config.type || (this.config.states && Object.keys(this.config.states).length ? "compound" : this.config.history ? "history" : "atomic");
    this.description = this.config.description;
    this.order = this.machine.idMap.size;
    this.machine.idMap.set(this.id, this);
    this.states = this.config.states ? mapValues(this.config.states, (stateConfig, key) => {
      const stateNode = new StateNode(stateConfig, {
        _parent: this,
        _key: key,
        _machine: this.machine
      });
      return stateNode;
    }) : EMPTY_OBJECT;
    if (this.type === "compound" && !this.config.initial) {
      throw new Error(`No initial state specified for compound state node "#${this.id}". Try adding { initial: "${Object.keys(this.states)[0]}" } to the state config.`);
    }
    this.history = this.config.history === true ? "shallow" : this.config.history || false;
    this.entry = toArray$2(this.config.entry).slice();
    this.exit = toArray$2(this.config.exit).slice();
    this.meta = this.config.meta;
    this.output = this.type === "final" || !this.parent ? this.config.output : void 0;
    this.tags = toArray$2(config2.tags).slice();
  }
  /** @internal */
  _initialize() {
    this.transitions = formatTransitions(this);
    if (this.config.always) {
      this.always = toTransitionConfigArray(this.config.always).map((t) => formatTransition(this, NULL_EVENT, t));
    }
    Object.keys(this.states).forEach((key) => {
      this.states[key]._initialize();
    });
  }
  /** The well-structured state node definition. */
  get definition() {
    return {
      id: this.id,
      key: this.key,
      version: this.machine.version,
      type: this.type,
      initial: this.initial ? {
        target: this.initial.target,
        source: this,
        actions: this.initial.actions.map(toSerializableAction),
        eventType: null,
        reenter: false,
        toJSON: () => ({
          target: this.initial.target.map((t) => `#${t.id}`),
          source: `#${this.id}`,
          actions: this.initial.actions.map(toSerializableAction),
          eventType: null
        })
      } : void 0,
      history: this.history,
      states: mapValues(this.states, (state) => {
        return state.definition;
      }),
      on: this.on,
      transitions: [...this.transitions.values()].flat().map((t) => ({
        ...t,
        actions: t.actions.map(toSerializableAction)
      })),
      entry: this.entry.map(toSerializableAction),
      exit: this.exit.map(toSerializableAction),
      meta: this.meta,
      order: this.order || -1,
      output: this.output,
      invoke: this.invoke,
      description: this.description,
      tags: this.tags
    };
  }
  /** @internal */
  toJSON() {
    return this.definition;
  }
  /** The logic invoked as actors by this state node. */
  get invoke() {
    return memo(this, "invoke", () => toArray$2(this.config.invoke).map((invokeConfig, i) => {
      const {
        src,
        systemId
      } = invokeConfig;
      const resolvedId = invokeConfig.id ?? createInvokeId(this.id, i);
      const resolvedSrc = typeof src === "string" ? src : `xstate.invoke.${createInvokeId(this.id, i)}`;
      return {
        ...invokeConfig,
        src: resolvedSrc,
        id: resolvedId,
        systemId,
        toJSON() {
          const {
            onDone,
            onError,
            ...invokeDefValues
          } = invokeConfig;
          return {
            ...invokeDefValues,
            type: "xstate.invoke",
            src: resolvedSrc,
            id: resolvedId
          };
        }
      };
    }));
  }
  /** The mapping of events to transitions. */
  get on() {
    return memo(this, "on", () => {
      const transitions = this.transitions;
      return [...transitions].flatMap(([descriptor, t]) => t.map((t2) => [descriptor, t2])).reduce((map2, [descriptor, transition]) => {
        map2[descriptor] = map2[descriptor] || [];
        map2[descriptor].push(transition);
        return map2;
      }, {});
    });
  }
  get after() {
    return memo(this, "delayedTransitions", () => getDelayedTransitions(this));
  }
  get initial() {
    return memo(this, "initial", () => formatInitialTransition(this, this.config.initial));
  }
  /** @internal */
  next(snapshot, event) {
    const eventType = event.type;
    const actions = [];
    let selectedTransition;
    const candidates = memo(this, `candidates-${eventType}`, () => getCandidates(this, eventType));
    for (const candidate of candidates) {
      const {
        guard
      } = candidate;
      const resolvedContext = snapshot.context;
      let guardPassed = false;
      try {
        guardPassed = !guard || evaluateGuard(guard, resolvedContext, event, snapshot);
      } catch (err) {
        const guardType = typeof guard === "string" ? guard : typeof guard === "object" ? guard.type : void 0;
        throw new Error(`Unable to evaluate guard ${guardType ? `'${guardType}' ` : ""}in transition for event '${eventType}' in state node '${this.id}':
${err.message}`);
      }
      if (guardPassed) {
        actions.push(...candidate.actions);
        selectedTransition = candidate;
        break;
      }
    }
    return selectedTransition ? [selectedTransition] : void 0;
  }
  /** All the event types accepted by this state node and its descendants. */
  get events() {
    return memo(this, "events", () => {
      const {
        states
      } = this;
      const events = new Set(this.ownEvents);
      if (states) {
        for (const stateId of Object.keys(states)) {
          const state = states[stateId];
          if (state.states) {
            for (const event of state.events) {
              events.add(`${event}`);
            }
          }
        }
      }
      return Array.from(events);
    });
  }
  /**
   * All the events that have transitions directly from this state node.
   *
   * Excludes any inert events.
   */
  get ownEvents() {
    const events = new Set([...this.transitions.keys()].filter((descriptor) => {
      return this.transitions.get(descriptor).some((transition) => !(!transition.target && !transition.actions.length && !transition.reenter));
    }));
    return Array.from(events);
  }
}
const STATE_IDENTIFIER = "#";
class StateMachine {
  constructor(config2, implementations) {
    this.config = config2;
    this.version = void 0;
    this.schemas = void 0;
    this.implementations = void 0;
    this.__xstatenode = true;
    this.idMap = /* @__PURE__ */ new Map();
    this.root = void 0;
    this.id = void 0;
    this.states = void 0;
    this.events = void 0;
    this.id = config2.id || "(machine)";
    this.implementations = {
      actors: implementations?.actors ?? {},
      actions: implementations?.actions ?? {},
      delays: implementations?.delays ?? {},
      guards: implementations?.guards ?? {}
    };
    this.version = this.config.version;
    this.schemas = this.config.schemas;
    this.transition = this.transition.bind(this);
    this.getInitialSnapshot = this.getInitialSnapshot.bind(this);
    this.getPersistedSnapshot = this.getPersistedSnapshot.bind(this);
    this.restoreSnapshot = this.restoreSnapshot.bind(this);
    this.start = this.start.bind(this);
    this.root = new StateNode(config2, {
      _key: this.id,
      _machine: this
    });
    this.root._initialize();
    this.states = this.root.states;
    this.events = this.root.events;
  }
  /**
   * Clones this state machine with the provided implementations and merges the
   * `context` (if provided).
   *
   * @param implementations Options (`actions`, `guards`, `actors`, `delays`,
   *   `context`) to recursively merge with the existing options.
   * @returns A new `StateMachine` instance with the provided implementations.
   */
  provide(implementations) {
    const {
      actions,
      guards,
      actors,
      delays
    } = this.implementations;
    return new StateMachine(this.config, {
      actions: {
        ...actions,
        ...implementations.actions
      },
      guards: {
        ...guards,
        ...implementations.guards
      },
      actors: {
        ...actors,
        ...implementations.actors
      },
      delays: {
        ...delays,
        ...implementations.delays
      }
    });
  }
  resolveState(config2) {
    const resolvedStateValue = resolveStateValue(this.root, config2.value);
    const nodeSet = getAllStateNodes(getStateNodes(this.root, resolvedStateValue));
    return createMachineSnapshot({
      _nodes: [...nodeSet],
      context: config2.context || {},
      children: {},
      status: isInFinalState(nodeSet, this.root) ? "done" : config2.status || "active",
      output: config2.output,
      error: config2.error,
      historyValue: config2.historyValue
    }, this);
  }
  /**
   * Determines the next snapshot given the current `snapshot` and received
   * `event`. Calculates a full macrostep from all microsteps.
   *
   * @param snapshot The current snapshot
   * @param event The received event
   */
  transition(snapshot, event, actorScope) {
    return macrostep(snapshot, event, actorScope).snapshot;
  }
  /**
   * Determines the next state given the current `state` and `event`. Calculates
   * a microstep.
   *
   * @param state The current state
   * @param event The received event
   */
  microstep(snapshot, event, actorScope) {
    return macrostep(snapshot, event, actorScope).microstates;
  }
  getTransitionData(snapshot, event) {
    return transitionNode(this.root, snapshot.value, snapshot, event) || [];
  }
  /**
   * The initial state _before_ evaluating any microsteps. This "pre-initial"
   * state is provided to initial actions executed in the initial state.
   */
  getPreInitialState(actorScope, initEvent, internalQueue) {
    const {
      context: context2
    } = this.config;
    const preInitial = createMachineSnapshot({
      context: typeof context2 !== "function" && context2 ? context2 : {},
      _nodes: [this.root],
      children: {},
      status: "active"
    }, this);
    if (typeof context2 === "function") {
      const assignment = ({
        spawn,
        event,
        self: self2
      }) => context2({
        spawn,
        input: event.input,
        self: self2
      });
      return resolveActionsAndContext(preInitial, initEvent, actorScope, [assign(assignment)], internalQueue);
    }
    return preInitial;
  }
  /**
   * Returns the initial `State` instance, with reference to `self` as an
   * `ActorRef`.
   */
  getInitialSnapshot(actorScope, input) {
    const initEvent = createInitEvent(input);
    const internalQueue = [];
    const preInitialState = this.getPreInitialState(actorScope, initEvent, internalQueue);
    const nextState = microstep([{
      target: [...getInitialStateNodes(this.root)],
      source: this.root,
      reenter: true,
      actions: [],
      eventType: null,
      toJSON: null
      // TODO: fix
    }], preInitialState, actorScope, initEvent, true, internalQueue);
    const {
      snapshot: macroState
    } = macrostep(nextState, initEvent, actorScope, internalQueue);
    return macroState;
  }
  start(snapshot) {
    Object.values(snapshot.children).forEach((child) => {
      if (child.getSnapshot().status === "active") {
        child.start();
      }
    });
  }
  getStateNodeById(stateId) {
    const fullPath = toStatePath(stateId);
    const relativePath = fullPath.slice(1);
    const resolvedStateId = isStateId(fullPath[0]) ? fullPath[0].slice(STATE_IDENTIFIER.length) : fullPath[0];
    const stateNode = this.idMap.get(resolvedStateId);
    if (!stateNode) {
      throw new Error(`Child state node '#${resolvedStateId}' does not exist on machine '${this.id}'`);
    }
    return getStateNodeByPath(stateNode, relativePath);
  }
  get definition() {
    return this.root.definition;
  }
  toJSON() {
    return this.definition;
  }
  getPersistedSnapshot(snapshot, options) {
    return getPersistedSnapshot(snapshot, options);
  }
  restoreSnapshot(snapshot, _actorScope) {
    const children = {};
    const snapshotChildren = snapshot.children;
    Object.keys(snapshotChildren).forEach((actorId) => {
      const actorData = snapshotChildren[actorId];
      const childState = actorData.snapshot;
      const src = actorData.src;
      const logic = typeof src === "string" ? resolveReferencedActor(this, src) : src;
      if (!logic) {
        return;
      }
      const actorRef = createActor(logic, {
        id: actorId,
        parent: _actorScope.self,
        syncSnapshot: actorData.syncSnapshot,
        snapshot: childState,
        src,
        systemId: actorData.systemId
      });
      children[actorId] = actorRef;
    });
    const restoredSnapshot = createMachineSnapshot({
      ...snapshot,
      children,
      _nodes: Array.from(getAllStateNodes(getStateNodes(this.root, snapshot.value)))
    }, this);
    let seen = /* @__PURE__ */ new Set();
    function reviveContext(contextPart, children2) {
      if (seen.has(contextPart)) {
        return;
      }
      seen.add(contextPart);
      for (let key in contextPart) {
        const value = contextPart[key];
        if (value && typeof value === "object") {
          if ("xstate$$type" in value && value.xstate$$type === $$ACTOR_TYPE) {
            contextPart[key] = children2[value.id];
            continue;
          }
          reviveContext(value, children2);
        }
      }
    }
    reviveContext(restoredSnapshot.context, children);
    return restoredSnapshot;
  }
}
function createMachine(config2, implementations) {
  return new StateMachine(config2, implementations);
}
function setup({
  schemas,
  actors,
  actions,
  guards,
  delays
}) {
  return {
    createMachine: (config2) => createMachine({
      ...config2,
      schemas
    }, {
      actors,
      actions,
      guards,
      delays
    })
  };
}
var cjs = {};
var Observable$1 = {};
var Subscriber = {};
var isFunction$1 = {};
Object.defineProperty(isFunction$1, "__esModule", { value: true });
isFunction$1.isFunction = void 0;
function isFunction(value) {
  return typeof value === "function";
}
isFunction$1.isFunction = isFunction;
var Subscription$1 = {};
var UnsubscriptionError = {};
var createErrorClass$1 = {};
Object.defineProperty(createErrorClass$1, "__esModule", { value: true });
createErrorClass$1.createErrorClass = void 0;
function createErrorClass(createImpl) {
  var _super = function(instance) {
    Error.call(instance);
    instance.stack = new Error().stack;
  };
  var ctorFunc = createImpl(_super);
  ctorFunc.prototype = Object.create(Error.prototype);
  ctorFunc.prototype.constructor = ctorFunc;
  return ctorFunc;
}
createErrorClass$1.createErrorClass = createErrorClass;
Object.defineProperty(UnsubscriptionError, "__esModule", { value: true });
UnsubscriptionError.UnsubscriptionError = void 0;
var createErrorClass_1$5 = createErrorClass$1;
UnsubscriptionError.UnsubscriptionError = createErrorClass_1$5.createErrorClass(function(_super) {
  return function UnsubscriptionErrorImpl(errors) {
    _super(this);
    this.message = errors ? errors.length + " errors occurred during unsubscription:\n" + errors.map(function(err, i) {
      return i + 1 + ") " + err.toString();
    }).join("\n  ") : "";
    this.name = "UnsubscriptionError";
    this.errors = errors;
  };
});
var arrRemove$1 = {};
Object.defineProperty(arrRemove$1, "__esModule", { value: true });
arrRemove$1.arrRemove = void 0;
function arrRemove(arr, item) {
  if (arr) {
    var index = arr.indexOf(item);
    0 <= index && arr.splice(index, 1);
  }
}
arrRemove$1.arrRemove = arrRemove;
var __values$8 = commonjsGlobal && commonjsGlobal.__values || function(o) {
  var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
    next: function() {
      if (o && i >= o.length) o = void 0;
      return { value: o && o[i++], done: !o };
    }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read$h = commonjsGlobal && commonjsGlobal.__read || function(o, n2) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
    while ((n2 === void 0 || n2-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar;
};
var __spreadArray$g = commonjsGlobal && commonjsGlobal.__spreadArray || function(to, from2) {
  for (var i = 0, il = from2.length, j2 = to.length; i < il; i++, j2++)
    to[j2] = from2[i];
  return to;
};
Object.defineProperty(Subscription$1, "__esModule", { value: true });
Subscription$1.isSubscription = Subscription$1.EMPTY_SUBSCRIPTION = Subscription$1.Subscription = void 0;
var isFunction_1$p = isFunction$1;
var UnsubscriptionError_1 = UnsubscriptionError;
var arrRemove_1$7 = arrRemove$1;
var Subscription = function() {
  function Subscription2(initialTeardown) {
    this.initialTeardown = initialTeardown;
    this.closed = false;
    this._parentage = null;
    this._finalizers = null;
  }
  Subscription2.prototype.unsubscribe = function() {
    var e_1, _a, e_2, _b;
    var errors;
    if (!this.closed) {
      this.closed = true;
      var _parentage = this._parentage;
      if (_parentage) {
        this._parentage = null;
        if (Array.isArray(_parentage)) {
          try {
            for (var _parentage_1 = __values$8(_parentage), _parentage_1_1 = _parentage_1.next(); !_parentage_1_1.done; _parentage_1_1 = _parentage_1.next()) {
              var parent_1 = _parentage_1_1.value;
              parent_1.remove(this);
            }
          } catch (e_1_1) {
            e_1 = { error: e_1_1 };
          } finally {
            try {
              if (_parentage_1_1 && !_parentage_1_1.done && (_a = _parentage_1.return)) _a.call(_parentage_1);
            } finally {
              if (e_1) throw e_1.error;
            }
          }
        } else {
          _parentage.remove(this);
        }
      }
      var initialFinalizer = this.initialTeardown;
      if (isFunction_1$p.isFunction(initialFinalizer)) {
        try {
          initialFinalizer();
        } catch (e) {
          errors = e instanceof UnsubscriptionError_1.UnsubscriptionError ? e.errors : [e];
        }
      }
      var _finalizers = this._finalizers;
      if (_finalizers) {
        this._finalizers = null;
        try {
          for (var _finalizers_1 = __values$8(_finalizers), _finalizers_1_1 = _finalizers_1.next(); !_finalizers_1_1.done; _finalizers_1_1 = _finalizers_1.next()) {
            var finalizer = _finalizers_1_1.value;
            try {
              execFinalizer(finalizer);
            } catch (err) {
              errors = errors !== null && errors !== void 0 ? errors : [];
              if (err instanceof UnsubscriptionError_1.UnsubscriptionError) {
                errors = __spreadArray$g(__spreadArray$g([], __read$h(errors)), __read$h(err.errors));
              } else {
                errors.push(err);
              }
            }
          }
        } catch (e_2_1) {
          e_2 = { error: e_2_1 };
        } finally {
          try {
            if (_finalizers_1_1 && !_finalizers_1_1.done && (_b = _finalizers_1.return)) _b.call(_finalizers_1);
          } finally {
            if (e_2) throw e_2.error;
          }
        }
      }
      if (errors) {
        throw new UnsubscriptionError_1.UnsubscriptionError(errors);
      }
    }
  };
  Subscription2.prototype.add = function(teardown) {
    var _a;
    if (teardown && teardown !== this) {
      if (this.closed) {
        execFinalizer(teardown);
      } else {
        if (teardown instanceof Subscription2) {
          if (teardown.closed || teardown._hasParent(this)) {
            return;
          }
          teardown._addParent(this);
        }
        (this._finalizers = (_a = this._finalizers) !== null && _a !== void 0 ? _a : []).push(teardown);
      }
    }
  };
  Subscription2.prototype._hasParent = function(parent) {
    var _parentage = this._parentage;
    return _parentage === parent || Array.isArray(_parentage) && _parentage.includes(parent);
  };
  Subscription2.prototype._addParent = function(parent) {
    var _parentage = this._parentage;
    this._parentage = Array.isArray(_parentage) ? (_parentage.push(parent), _parentage) : _parentage ? [_parentage, parent] : parent;
  };
  Subscription2.prototype._removeParent = function(parent) {
    var _parentage = this._parentage;
    if (_parentage === parent) {
      this._parentage = null;
    } else if (Array.isArray(_parentage)) {
      arrRemove_1$7.arrRemove(_parentage, parent);
    }
  };
  Subscription2.prototype.remove = function(teardown) {
    var _finalizers = this._finalizers;
    _finalizers && arrRemove_1$7.arrRemove(_finalizers, teardown);
    if (teardown instanceof Subscription2) {
      teardown._removeParent(this);
    }
  };
  Subscription2.EMPTY = function() {
    var empty2 = new Subscription2();
    empty2.closed = true;
    return empty2;
  }();
  return Subscription2;
}();
Subscription$1.Subscription = Subscription;
Subscription$1.EMPTY_SUBSCRIPTION = Subscription.EMPTY;
function isSubscription(value) {
  return value instanceof Subscription || value && "closed" in value && isFunction_1$p.isFunction(value.remove) && isFunction_1$p.isFunction(value.add) && isFunction_1$p.isFunction(value.unsubscribe);
}
Subscription$1.isSubscription = isSubscription;
function execFinalizer(finalizer) {
  if (isFunction_1$p.isFunction(finalizer)) {
    finalizer();
  } else {
    finalizer.unsubscribe();
  }
}
var config = {};
Object.defineProperty(config, "__esModule", { value: true });
config.config = void 0;
config.config = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: false,
  useDeprecatedNextContext: false
};
var reportUnhandledError$1 = {};
var timeoutProvider = {};
(function(exports) {
  var __read2 = commonjsGlobal && commonjsGlobal.__read || function(o, n2) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n2 === void 0 || n2-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
  var __spreadArray2 = commonjsGlobal && commonjsGlobal.__spreadArray || function(to, from2) {
    for (var i = 0, il = from2.length, j2 = to.length; i < il; i++, j2++)
      to[j2] = from2[i];
    return to;
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.timeoutProvider = void 0;
  exports.timeoutProvider = {
    setTimeout: function(handler, timeout2) {
      var args2 = [];
      for (var _i = 2; _i < arguments.length; _i++) {
        args2[_i - 2] = arguments[_i];
      }
      var delegate = exports.timeoutProvider.delegate;
      if (delegate === null || delegate === void 0 ? void 0 : delegate.setTimeout) {
        return delegate.setTimeout.apply(delegate, __spreadArray2([handler, timeout2], __read2(args2)));
      }
      return setTimeout.apply(void 0, __spreadArray2([handler, timeout2], __read2(args2)));
    },
    clearTimeout: function(handle) {
      var delegate = exports.timeoutProvider.delegate;
      return ((delegate === null || delegate === void 0 ? void 0 : delegate.clearTimeout) || clearTimeout)(handle);
    },
    delegate: void 0
  };
})(timeoutProvider);
Object.defineProperty(reportUnhandledError$1, "__esModule", { value: true });
reportUnhandledError$1.reportUnhandledError = void 0;
var config_1$2 = config;
var timeoutProvider_1 = timeoutProvider;
function reportUnhandledError(err) {
  timeoutProvider_1.timeoutProvider.setTimeout(function() {
    var onUnhandledError = config_1$2.config.onUnhandledError;
    if (onUnhandledError) {
      onUnhandledError(err);
    } else {
      throw err;
    }
  });
}
reportUnhandledError$1.reportUnhandledError = reportUnhandledError;
var noop$1 = {};
Object.defineProperty(noop$1, "__esModule", { value: true });
noop$1.noop = void 0;
function noop() {
}
noop$1.noop = noop;
var NotificationFactories = {};
Object.defineProperty(NotificationFactories, "__esModule", { value: true });
NotificationFactories.createNotification = NotificationFactories.nextNotification = NotificationFactories.errorNotification = NotificationFactories.COMPLETE_NOTIFICATION = void 0;
NotificationFactories.COMPLETE_NOTIFICATION = function() {
  return createNotification("C", void 0, void 0);
}();
function errorNotification(error) {
  return createNotification("E", void 0, error);
}
NotificationFactories.errorNotification = errorNotification;
function nextNotification(value) {
  return createNotification("N", value, void 0);
}
NotificationFactories.nextNotification = nextNotification;
function createNotification(kind, value, error) {
  return {
    kind,
    value,
    error
  };
}
NotificationFactories.createNotification = createNotification;
var errorContext$1 = {};
Object.defineProperty(errorContext$1, "__esModule", { value: true });
errorContext$1.captureError = errorContext$1.errorContext = void 0;
var config_1$1 = config;
var context = null;
function errorContext(cb) {
  if (config_1$1.config.useDeprecatedSynchronousErrorHandling) {
    var isRoot = !context;
    if (isRoot) {
      context = { errorThrown: false, error: null };
    }
    cb();
    if (isRoot) {
      var _a = context, errorThrown = _a.errorThrown, error = _a.error;
      context = null;
      if (errorThrown) {
        throw error;
      }
    }
  } else {
    cb();
  }
}
errorContext$1.errorContext = errorContext;
function captureError(err) {
  if (config_1$1.config.useDeprecatedSynchronousErrorHandling && context) {
    context.errorThrown = true;
    context.error = err;
  }
}
errorContext$1.captureError = captureError;
(function(exports) {
  var __extends2 = commonjsGlobal && commonjsGlobal.__extends || /* @__PURE__ */ function() {
    var extendStatics = function(d2, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d3, b2) {
        d3.__proto__ = b2;
      } || function(d3, b2) {
        for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d3[p] = b2[p];
      };
      return extendStatics(d2, b);
    };
    return function(d2, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d2, b);
      function __() {
        this.constructor = d2;
      }
      d2.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  }();
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.EMPTY_OBSERVER = exports.SafeSubscriber = exports.Subscriber = void 0;
  var isFunction_12 = isFunction$1;
  var Subscription_12 = Subscription$1;
  var config_12 = config;
  var reportUnhandledError_12 = reportUnhandledError$1;
  var noop_12 = noop$1;
  var NotificationFactories_1 = NotificationFactories;
  var timeoutProvider_12 = timeoutProvider;
  var errorContext_12 = errorContext$1;
  var Subscriber2 = function(_super) {
    __extends2(Subscriber3, _super);
    function Subscriber3(destination) {
      var _this = _super.call(this) || this;
      _this.isStopped = false;
      if (destination) {
        _this.destination = destination;
        if (Subscription_12.isSubscription(destination)) {
          destination.add(_this);
        }
      } else {
        _this.destination = exports.EMPTY_OBSERVER;
      }
      return _this;
    }
    Subscriber3.create = function(next, error, complete) {
      return new SafeSubscriber(next, error, complete);
    };
    Subscriber3.prototype.next = function(value) {
      if (this.isStopped) {
        handleStoppedNotification(NotificationFactories_1.nextNotification(value), this);
      } else {
        this._next(value);
      }
    };
    Subscriber3.prototype.error = function(err) {
      if (this.isStopped) {
        handleStoppedNotification(NotificationFactories_1.errorNotification(err), this);
      } else {
        this.isStopped = true;
        this._error(err);
      }
    };
    Subscriber3.prototype.complete = function() {
      if (this.isStopped) {
        handleStoppedNotification(NotificationFactories_1.COMPLETE_NOTIFICATION, this);
      } else {
        this.isStopped = true;
        this._complete();
      }
    };
    Subscriber3.prototype.unsubscribe = function() {
      if (!this.closed) {
        this.isStopped = true;
        _super.prototype.unsubscribe.call(this);
        this.destination = null;
      }
    };
    Subscriber3.prototype._next = function(value) {
      this.destination.next(value);
    };
    Subscriber3.prototype._error = function(err) {
      try {
        this.destination.error(err);
      } finally {
        this.unsubscribe();
      }
    };
    Subscriber3.prototype._complete = function() {
      try {
        this.destination.complete();
      } finally {
        this.unsubscribe();
      }
    };
    return Subscriber3;
  }(Subscription_12.Subscription);
  exports.Subscriber = Subscriber2;
  var _bind = Function.prototype.bind;
  function bind(fn, thisArg) {
    return _bind.call(fn, thisArg);
  }
  var ConsumerObserver = function() {
    function ConsumerObserver2(partialObserver) {
      this.partialObserver = partialObserver;
    }
    ConsumerObserver2.prototype.next = function(value) {
      var partialObserver = this.partialObserver;
      if (partialObserver.next) {
        try {
          partialObserver.next(value);
        } catch (error) {
          handleUnhandledError(error);
        }
      }
    };
    ConsumerObserver2.prototype.error = function(err) {
      var partialObserver = this.partialObserver;
      if (partialObserver.error) {
        try {
          partialObserver.error(err);
        } catch (error) {
          handleUnhandledError(error);
        }
      } else {
        handleUnhandledError(err);
      }
    };
    ConsumerObserver2.prototype.complete = function() {
      var partialObserver = this.partialObserver;
      if (partialObserver.complete) {
        try {
          partialObserver.complete();
        } catch (error) {
          handleUnhandledError(error);
        }
      }
    };
    return ConsumerObserver2;
  }();
  var SafeSubscriber = function(_super) {
    __extends2(SafeSubscriber2, _super);
    function SafeSubscriber2(observerOrNext, error, complete) {
      var _this = _super.call(this) || this;
      var partialObserver;
      if (isFunction_12.isFunction(observerOrNext) || !observerOrNext) {
        partialObserver = {
          next: observerOrNext !== null && observerOrNext !== void 0 ? observerOrNext : void 0,
          error: error !== null && error !== void 0 ? error : void 0,
          complete: complete !== null && complete !== void 0 ? complete : void 0
        };
      } else {
        var context_1;
        if (_this && config_12.config.useDeprecatedNextContext) {
          context_1 = Object.create(observerOrNext);
          context_1.unsubscribe = function() {
            return _this.unsubscribe();
          };
          partialObserver = {
            next: observerOrNext.next && bind(observerOrNext.next, context_1),
            error: observerOrNext.error && bind(observerOrNext.error, context_1),
            complete: observerOrNext.complete && bind(observerOrNext.complete, context_1)
          };
        } else {
          partialObserver = observerOrNext;
        }
      }
      _this.destination = new ConsumerObserver(partialObserver);
      return _this;
    }
    return SafeSubscriber2;
  }(Subscriber2);
  exports.SafeSubscriber = SafeSubscriber;
  function handleUnhandledError(error) {
    if (config_12.config.useDeprecatedSynchronousErrorHandling) {
      errorContext_12.captureError(error);
    } else {
      reportUnhandledError_12.reportUnhandledError(error);
    }
  }
  function defaultErrorHandler(err) {
    throw err;
  }
  function handleStoppedNotification(notification, subscriber) {
    var onStoppedNotification = config_12.config.onStoppedNotification;
    onStoppedNotification && timeoutProvider_12.timeoutProvider.setTimeout(function() {
      return onStoppedNotification(notification, subscriber);
    });
  }
  exports.EMPTY_OBSERVER = {
    closed: true,
    next: noop_12.noop,
    error: defaultErrorHandler,
    complete: noop_12.noop
  };
})(Subscriber);
var observable = {};
Object.defineProperty(observable, "__esModule", { value: true });
observable.observable = void 0;
observable.observable = function() {
  return typeof Symbol === "function" && Symbol.observable || "@@observable";
}();
var pipe$1 = {};
var identity$1 = {};
Object.defineProperty(identity$1, "__esModule", { value: true });
identity$1.identity = void 0;
function identity(x2) {
  return x2;
}
identity$1.identity = identity;
Object.defineProperty(pipe$1, "__esModule", { value: true });
pipe$1.pipeFromArray = pipe$1.pipe = void 0;
var identity_1$e = identity$1;
function pipe() {
  var fns = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    fns[_i] = arguments[_i];
  }
  return pipeFromArray(fns);
}
pipe$1.pipe = pipe;
function pipeFromArray(fns) {
  if (fns.length === 0) {
    return identity_1$e.identity;
  }
  if (fns.length === 1) {
    return fns[0];
  }
  return function piped(input) {
    return fns.reduce(function(prev, fn) {
      return fn(prev);
    }, input);
  };
}
pipe$1.pipeFromArray = pipeFromArray;
Object.defineProperty(Observable$1, "__esModule", { value: true });
Observable$1.Observable = void 0;
var Subscriber_1$3 = Subscriber;
var Subscription_1$8 = Subscription$1;
var observable_1$2 = observable;
var pipe_1$2 = pipe$1;
var config_1 = config;
var isFunction_1$o = isFunction$1;
var errorContext_1$1 = errorContext$1;
var Observable = function() {
  function Observable2(subscribe) {
    if (subscribe) {
      this._subscribe = subscribe;
    }
  }
  Observable2.prototype.lift = function(operator) {
    var observable2 = new Observable2();
    observable2.source = this;
    observable2.operator = operator;
    return observable2;
  };
  Observable2.prototype.subscribe = function(observerOrNext, error, complete) {
    var _this = this;
    var subscriber = isSubscriber(observerOrNext) ? observerOrNext : new Subscriber_1$3.SafeSubscriber(observerOrNext, error, complete);
    errorContext_1$1.errorContext(function() {
      var _a = _this, operator = _a.operator, source = _a.source;
      subscriber.add(operator ? operator.call(subscriber, source) : source ? _this._subscribe(subscriber) : _this._trySubscribe(subscriber));
    });
    return subscriber;
  };
  Observable2.prototype._trySubscribe = function(sink) {
    try {
      return this._subscribe(sink);
    } catch (err) {
      sink.error(err);
    }
  };
  Observable2.prototype.forEach = function(next, promiseCtor) {
    var _this = this;
    promiseCtor = getPromiseCtor(promiseCtor);
    return new promiseCtor(function(resolve, reject) {
      var subscriber = new Subscriber_1$3.SafeSubscriber({
        next: function(value) {
          try {
            next(value);
          } catch (err) {
            reject(err);
            subscriber.unsubscribe();
          }
        },
        error: reject,
        complete: resolve
      });
      _this.subscribe(subscriber);
    });
  };
  Observable2.prototype._subscribe = function(subscriber) {
    var _a;
    return (_a = this.source) === null || _a === void 0 ? void 0 : _a.subscribe(subscriber);
  };
  Observable2.prototype[observable_1$2.observable] = function() {
    return this;
  };
  Observable2.prototype.pipe = function() {
    var operations = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      operations[_i] = arguments[_i];
    }
    return pipe_1$2.pipeFromArray(operations)(this);
  };
  Observable2.prototype.toPromise = function(promiseCtor) {
    var _this = this;
    promiseCtor = getPromiseCtor(promiseCtor);
    return new promiseCtor(function(resolve, reject) {
      var value;
      _this.subscribe(function(x2) {
        return value = x2;
      }, function(err) {
        return reject(err);
      }, function() {
        return resolve(value);
      });
    });
  };
  Observable2.create = function(subscribe) {
    return new Observable2(subscribe);
  };
  return Observable2;
}();
Observable$1.Observable = Observable;
function getPromiseCtor(promiseCtor) {
  var _a;
  return (_a = promiseCtor !== null && promiseCtor !== void 0 ? promiseCtor : config_1.config.Promise) !== null && _a !== void 0 ? _a : Promise;
}
function isObserver(value) {
  return value && isFunction_1$o.isFunction(value.next) && isFunction_1$o.isFunction(value.error) && isFunction_1$o.isFunction(value.complete);
}
function isSubscriber(value) {
  return value && value instanceof Subscriber_1$3.Subscriber || isObserver(value) && Subscription_1$8.isSubscription(value);
}
var ConnectableObservable$1 = {};
var refCount$1 = {};
var lift = {};
Object.defineProperty(lift, "__esModule", { value: true });
lift.operate = lift.hasLift = void 0;
var isFunction_1$n = isFunction$1;
function hasLift(source) {
  return isFunction_1$n.isFunction(source === null || source === void 0 ? void 0 : source.lift);
}
lift.hasLift = hasLift;
function operate(init) {
  return function(source) {
    if (hasLift(source)) {
      return source.lift(function(liftedSource) {
        try {
          return init(liftedSource, this);
        } catch (err) {
          this.error(err);
        }
      });
    }
    throw new TypeError("Unable to lift unknown Observable type");
  };
}
lift.operate = operate;
var OperatorSubscriber$1 = {};
var __extends$f = commonjsGlobal && commonjsGlobal.__extends || /* @__PURE__ */ function() {
  var extendStatics = function(d2, b) {
    extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d3, b2) {
      d3.__proto__ = b2;
    } || function(d3, b2) {
      for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d3[p] = b2[p];
    };
    return extendStatics(d2, b);
  };
  return function(d2, b) {
    if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d2, b);
    function __() {
      this.constructor = d2;
    }
    d2.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();
Object.defineProperty(OperatorSubscriber$1, "__esModule", { value: true });
OperatorSubscriber$1.OperatorSubscriber = OperatorSubscriber$1.createOperatorSubscriber = void 0;
var Subscriber_1$2 = Subscriber;
function createOperatorSubscriber(destination, onNext, onComplete, onError, onFinalize) {
  return new OperatorSubscriber(destination, onNext, onComplete, onError, onFinalize);
}
OperatorSubscriber$1.createOperatorSubscriber = createOperatorSubscriber;
var OperatorSubscriber = function(_super) {
  __extends$f(OperatorSubscriber2, _super);
  function OperatorSubscriber2(destination, onNext, onComplete, onError, onFinalize, shouldUnsubscribe) {
    var _this = _super.call(this, destination) || this;
    _this.onFinalize = onFinalize;
    _this.shouldUnsubscribe = shouldUnsubscribe;
    _this._next = onNext ? function(value) {
      try {
        onNext(value);
      } catch (err) {
        destination.error(err);
      }
    } : _super.prototype._next;
    _this._error = onError ? function(err) {
      try {
        onError(err);
      } catch (err2) {
        destination.error(err2);
      } finally {
        this.unsubscribe();
      }
    } : _super.prototype._error;
    _this._complete = onComplete ? function() {
      try {
        onComplete();
      } catch (err) {
        destination.error(err);
      } finally {
        this.unsubscribe();
      }
    } : _super.prototype._complete;
    return _this;
  }
  OperatorSubscriber2.prototype.unsubscribe = function() {
    var _a;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      var closed_1 = this.closed;
      _super.prototype.unsubscribe.call(this);
      !closed_1 && ((_a = this.onFinalize) === null || _a === void 0 ? void 0 : _a.call(this));
    }
  };
  return OperatorSubscriber2;
}(Subscriber_1$2.Subscriber);
OperatorSubscriber$1.OperatorSubscriber = OperatorSubscriber;
Object.defineProperty(refCount$1, "__esModule", { value: true });
refCount$1.refCount = void 0;
var lift_1$14 = lift;
var OperatorSubscriber_1$V = OperatorSubscriber$1;
function refCount() {
  return lift_1$14.operate(function(source, subscriber) {
    var connection = null;
    source._refCount++;
    var refCounter = OperatorSubscriber_1$V.createOperatorSubscriber(subscriber, void 0, void 0, void 0, function() {
      if (!source || source._refCount <= 0 || 0 < --source._refCount) {
        connection = null;
        return;
      }
      var sharedConnection = source._connection;
      var conn = connection;
      connection = null;
      if (sharedConnection && (!conn || sharedConnection === conn)) {
        sharedConnection.unsubscribe();
      }
      subscriber.unsubscribe();
    });
    source.subscribe(refCounter);
    if (!refCounter.closed) {
      connection = source.connect();
    }
  });
}
refCount$1.refCount = refCount;
var __extends$e = commonjsGlobal && commonjsGlobal.__extends || /* @__PURE__ */ function() {
  var extendStatics = function(d2, b) {
    extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d3, b2) {
      d3.__proto__ = b2;
    } || function(d3, b2) {
      for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d3[p] = b2[p];
    };
    return extendStatics(d2, b);
  };
  return function(d2, b) {
    if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d2, b);
    function __() {
      this.constructor = d2;
    }
    d2.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();
Object.defineProperty(ConnectableObservable$1, "__esModule", { value: true });
ConnectableObservable$1.ConnectableObservable = void 0;
var Observable_1$n = Observable$1;
var Subscription_1$7 = Subscription$1;
var refCount_1 = refCount$1;
var OperatorSubscriber_1$U = OperatorSubscriber$1;
var lift_1$13 = lift;
var ConnectableObservable = function(_super) {
  __extends$e(ConnectableObservable2, _super);
  function ConnectableObservable2(source, subjectFactory) {
    var _this = _super.call(this) || this;
    _this.source = source;
    _this.subjectFactory = subjectFactory;
    _this._subject = null;
    _this._refCount = 0;
    _this._connection = null;
    if (lift_1$13.hasLift(source)) {
      _this.lift = source.lift;
    }
    return _this;
  }
  ConnectableObservable2.prototype._subscribe = function(subscriber) {
    return this.getSubject().subscribe(subscriber);
  };
  ConnectableObservable2.prototype.getSubject = function() {
    var subject = this._subject;
    if (!subject || subject.isStopped) {
      this._subject = this.subjectFactory();
    }
    return this._subject;
  };
  ConnectableObservable2.prototype._teardown = function() {
    this._refCount = 0;
    var _connection = this._connection;
    this._subject = this._connection = null;
    _connection === null || _connection === void 0 ? void 0 : _connection.unsubscribe();
  };
  ConnectableObservable2.prototype.connect = function() {
    var _this = this;
    var connection = this._connection;
    if (!connection) {
      connection = this._connection = new Subscription_1$7.Subscription();
      var subject_1 = this.getSubject();
      connection.add(this.source.subscribe(OperatorSubscriber_1$U.createOperatorSubscriber(subject_1, void 0, function() {
        _this._teardown();
        subject_1.complete();
      }, function(err) {
        _this._teardown();
        subject_1.error(err);
      }, function() {
        return _this._teardown();
      })));
      if (connection.closed) {
        this._connection = null;
        connection = Subscription_1$7.Subscription.EMPTY;
      }
    }
    return connection;
  };
  ConnectableObservable2.prototype.refCount = function() {
    return refCount_1.refCount()(this);
  };
  return ConnectableObservable2;
}(Observable_1$n.Observable);
ConnectableObservable$1.ConnectableObservable = ConnectableObservable;
var animationFrames$1 = {};
var performanceTimestampProvider = {};
(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.performanceTimestampProvider = void 0;
  exports.performanceTimestampProvider = {
    now: function() {
      return (exports.performanceTimestampProvider.delegate || performance).now();
    },
    delegate: void 0
  };
})(performanceTimestampProvider);
var animationFrameProvider = {};
(function(exports) {
  var __read2 = commonjsGlobal && commonjsGlobal.__read || function(o, n2) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n2 === void 0 || n2-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
  var __spreadArray2 = commonjsGlobal && commonjsGlobal.__spreadArray || function(to, from2) {
    for (var i = 0, il = from2.length, j2 = to.length; i < il; i++, j2++)
      to[j2] = from2[i];
    return to;
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.animationFrameProvider = void 0;
  var Subscription_12 = Subscription$1;
  exports.animationFrameProvider = {
    schedule: function(callback) {
      var request = requestAnimationFrame;
      var cancel2 = cancelAnimationFrame;
      var delegate = exports.animationFrameProvider.delegate;
      if (delegate) {
        request = delegate.requestAnimationFrame;
        cancel2 = delegate.cancelAnimationFrame;
      }
      var handle = request(function(timestamp2) {
        cancel2 = void 0;
        callback(timestamp2);
      });
      return new Subscription_12.Subscription(function() {
        return cancel2 === null || cancel2 === void 0 ? void 0 : cancel2(handle);
      });
    },
    requestAnimationFrame: function() {
      var args2 = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args2[_i] = arguments[_i];
      }
      var delegate = exports.animationFrameProvider.delegate;
      return ((delegate === null || delegate === void 0 ? void 0 : delegate.requestAnimationFrame) || requestAnimationFrame).apply(void 0, __spreadArray2([], __read2(args2)));
    },
    cancelAnimationFrame: function() {
      var args2 = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args2[_i] = arguments[_i];
      }
      var delegate = exports.animationFrameProvider.delegate;
      return ((delegate === null || delegate === void 0 ? void 0 : delegate.cancelAnimationFrame) || cancelAnimationFrame).apply(void 0, __spreadArray2([], __read2(args2)));
    },
    delegate: void 0
  };
})(animationFrameProvider);
Object.defineProperty(animationFrames$1, "__esModule", { value: true });
animationFrames$1.animationFrames = void 0;
var Observable_1$m = Observable$1;
var performanceTimestampProvider_1 = performanceTimestampProvider;
var animationFrameProvider_1$1 = animationFrameProvider;
function animationFrames(timestampProvider) {
  return timestampProvider ? animationFramesFactory(timestampProvider) : DEFAULT_ANIMATION_FRAMES;
}
animationFrames$1.animationFrames = animationFrames;
function animationFramesFactory(timestampProvider) {
  return new Observable_1$m.Observable(function(subscriber) {
    var provider = timestampProvider || performanceTimestampProvider_1.performanceTimestampProvider;
    var start = provider.now();
    var id = 0;
    var run = function() {
      if (!subscriber.closed) {
        id = animationFrameProvider_1$1.animationFrameProvider.requestAnimationFrame(function(timestamp2) {
          id = 0;
          var now = provider.now();
          subscriber.next({
            timestamp: timestampProvider ? now : timestamp2,
            elapsed: now - start
          });
          run();
        });
      }
    };
    run();
    return function() {
      if (id) {
        animationFrameProvider_1$1.animationFrameProvider.cancelAnimationFrame(id);
      }
    };
  });
}
var DEFAULT_ANIMATION_FRAMES = animationFramesFactory();
var Subject$1 = {};
var ObjectUnsubscribedError = {};
Object.defineProperty(ObjectUnsubscribedError, "__esModule", { value: true });
ObjectUnsubscribedError.ObjectUnsubscribedError = void 0;
var createErrorClass_1$4 = createErrorClass$1;
ObjectUnsubscribedError.ObjectUnsubscribedError = createErrorClass_1$4.createErrorClass(function(_super) {
  return function ObjectUnsubscribedErrorImpl() {
    _super(this);
    this.name = "ObjectUnsubscribedError";
    this.message = "object unsubscribed";
  };
});
var __extends$d = commonjsGlobal && commonjsGlobal.__extends || /* @__PURE__ */ function() {
  var extendStatics = function(d2, b) {
    extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d3, b2) {
      d3.__proto__ = b2;
    } || function(d3, b2) {
      for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d3[p] = b2[p];
    };
    return extendStatics(d2, b);
  };
  return function(d2, b) {
    if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d2, b);
    function __() {
      this.constructor = d2;
    }
    d2.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();
var __values$7 = commonjsGlobal && commonjsGlobal.__values || function(o) {
  var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
    next: function() {
      if (o && i >= o.length) o = void 0;
      return { value: o && o[i++], done: !o };
    }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(Subject$1, "__esModule", { value: true });
Subject$1.AnonymousSubject = Subject$1.Subject = void 0;
var Observable_1$l = Observable$1;
var Subscription_1$6 = Subscription$1;
var ObjectUnsubscribedError_1 = ObjectUnsubscribedError;
var arrRemove_1$6 = arrRemove$1;
var errorContext_1 = errorContext$1;
var Subject = function(_super) {
  __extends$d(Subject2, _super);
  function Subject2() {
    var _this = _super.call(this) || this;
    _this.closed = false;
    _this.currentObservers = null;
    _this.observers = [];
    _this.isStopped = false;
    _this.hasError = false;
    _this.thrownError = null;
    return _this;
  }
  Subject2.prototype.lift = function(operator) {
    var subject = new AnonymousSubject(this, this);
    subject.operator = operator;
    return subject;
  };
  Subject2.prototype._throwIfClosed = function() {
    if (this.closed) {
      throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
    }
  };
  Subject2.prototype.next = function(value) {
    var _this = this;
    errorContext_1.errorContext(function() {
      var e_1, _a;
      _this._throwIfClosed();
      if (!_this.isStopped) {
        if (!_this.currentObservers) {
          _this.currentObservers = Array.from(_this.observers);
        }
        try {
          for (var _b = __values$7(_this.currentObservers), _c = _b.next(); !_c.done; _c = _b.next()) {
            var observer = _c.value;
            observer.next(value);
          }
        } catch (e_1_1) {
          e_1 = { error: e_1_1 };
        } finally {
          try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
          } finally {
            if (e_1) throw e_1.error;
          }
        }
      }
    });
  };
  Subject2.prototype.error = function(err) {
    var _this = this;
    errorContext_1.errorContext(function() {
      _this._throwIfClosed();
      if (!_this.isStopped) {
        _this.hasError = _this.isStopped = true;
        _this.thrownError = err;
        var observers = _this.observers;
        while (observers.length) {
          observers.shift().error(err);
        }
      }
    });
  };
  Subject2.prototype.complete = function() {
    var _this = this;
    errorContext_1.errorContext(function() {
      _this._throwIfClosed();
      if (!_this.isStopped) {
        _this.isStopped = true;
        var observers = _this.observers;
        while (observers.length) {
          observers.shift().complete();
        }
      }
    });
  };
  Subject2.prototype.unsubscribe = function() {
    this.isStopped = this.closed = true;
    this.observers = this.currentObservers = null;
  };
  Object.defineProperty(Subject2.prototype, "observed", {
    get: function() {
      var _a;
      return ((_a = this.observers) === null || _a === void 0 ? void 0 : _a.length) > 0;
    },
    enumerable: false,
    configurable: true
  });
  Subject2.prototype._trySubscribe = function(subscriber) {
    this._throwIfClosed();
    return _super.prototype._trySubscribe.call(this, subscriber);
  };
  Subject2.prototype._subscribe = function(subscriber) {
    this._throwIfClosed();
    this._checkFinalizedStatuses(subscriber);
    return this._innerSubscribe(subscriber);
  };
  Subject2.prototype._innerSubscribe = function(subscriber) {
    var _this = this;
    var _a = this, hasError = _a.hasError, isStopped = _a.isStopped, observers = _a.observers;
    if (hasError || isStopped) {
      return Subscription_1$6.EMPTY_SUBSCRIPTION;
    }
    this.currentObservers = null;
    observers.push(subscriber);
    return new Subscription_1$6.Subscription(function() {
      _this.currentObservers = null;
      arrRemove_1$6.arrRemove(observers, subscriber);
    });
  };
  Subject2.prototype._checkFinalizedStatuses = function(subscriber) {
    var _a = this, hasError = _a.hasError, thrownError = _a.thrownError, isStopped = _a.isStopped;
    if (hasError) {
      subscriber.error(thrownError);
    } else if (isStopped) {
      subscriber.complete();
    }
  };
  Subject2.prototype.asObservable = function() {
    var observable2 = new Observable_1$l.Observable();
    observable2.source = this;
    return observable2;
  };
  Subject2.create = function(destination, source) {
    return new AnonymousSubject(destination, source);
  };
  return Subject2;
}(Observable_1$l.Observable);
Subject$1.Subject = Subject;
var AnonymousSubject = function(_super) {
  __extends$d(AnonymousSubject2, _super);
  function AnonymousSubject2(destination, source) {
    var _this = _super.call(this) || this;
    _this.destination = destination;
    _this.source = source;
    return _this;
  }
  AnonymousSubject2.prototype.next = function(value) {
    var _a, _b;
    (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.next) === null || _b === void 0 ? void 0 : _b.call(_a, value);
  };
  AnonymousSubject2.prototype.error = function(err) {
    var _a, _b;
    (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.call(_a, err);
  };
  AnonymousSubject2.prototype.complete = function() {
    var _a, _b;
    (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.complete) === null || _b === void 0 ? void 0 : _b.call(_a);
  };
  AnonymousSubject2.prototype._subscribe = function(subscriber) {
    var _a, _b;
    return (_b = (_a = this.source) === null || _a === void 0 ? void 0 : _a.subscribe(subscriber)) !== null && _b !== void 0 ? _b : Subscription_1$6.EMPTY_SUBSCRIPTION;
  };
  return AnonymousSubject2;
}(Subject);
Subject$1.AnonymousSubject = AnonymousSubject;
var BehaviorSubject$1 = {};
var __extends$c = commonjsGlobal && commonjsGlobal.__extends || /* @__PURE__ */ function() {
  var extendStatics = function(d2, b) {
    extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d3, b2) {
      d3.__proto__ = b2;
    } || function(d3, b2) {
      for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d3[p] = b2[p];
    };
    return extendStatics(d2, b);
  };
  return function(d2, b) {
    if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d2, b);
    function __() {
      this.constructor = d2;
    }
    d2.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();
Object.defineProperty(BehaviorSubject$1, "__esModule", { value: true });
BehaviorSubject$1.BehaviorSubject = void 0;
var Subject_1$e = Subject$1;
var BehaviorSubject = function(_super) {
  __extends$c(BehaviorSubject2, _super);
  function BehaviorSubject2(_value) {
    var _this = _super.call(this) || this;
    _this._value = _value;
    return _this;
  }
  Object.defineProperty(BehaviorSubject2.prototype, "value", {
    get: function() {
      return this.getValue();
    },
    enumerable: false,
    configurable: true
  });
  BehaviorSubject2.prototype._subscribe = function(subscriber) {
    var subscription = _super.prototype._subscribe.call(this, subscriber);
    !subscription.closed && subscriber.next(this._value);
    return subscription;
  };
  BehaviorSubject2.prototype.getValue = function() {
    var _a = this, hasError = _a.hasError, thrownError = _a.thrownError, _value = _a._value;
    if (hasError) {
      throw thrownError;
    }
    this._throwIfClosed();
    return _value;
  };
  BehaviorSubject2.prototype.next = function(value) {
    _super.prototype.next.call(this, this._value = value);
  };
  return BehaviorSubject2;
}(Subject_1$e.Subject);
BehaviorSubject$1.BehaviorSubject = BehaviorSubject;
var ReplaySubject$1 = {};
var dateTimestampProvider = {};
(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.dateTimestampProvider = void 0;
  exports.dateTimestampProvider = {
    now: function() {
      return (exports.dateTimestampProvider.delegate || Date).now();
    },
    delegate: void 0
  };
})(dateTimestampProvider);
var __extends$b = commonjsGlobal && commonjsGlobal.__extends || /* @__PURE__ */ function() {
  var extendStatics = function(d2, b) {
    extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d3, b2) {
      d3.__proto__ = b2;
    } || function(d3, b2) {
      for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d3[p] = b2[p];
    };
    return extendStatics(d2, b);
  };
  return function(d2, b) {
    if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d2, b);
    function __() {
      this.constructor = d2;
    }
    d2.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();
Object.defineProperty(ReplaySubject$1, "__esModule", { value: true });
ReplaySubject$1.ReplaySubject = void 0;
var Subject_1$d = Subject$1;
var dateTimestampProvider_1$2 = dateTimestampProvider;
var ReplaySubject = function(_super) {
  __extends$b(ReplaySubject2, _super);
  function ReplaySubject2(_bufferSize, _windowTime, _timestampProvider) {
    if (_bufferSize === void 0) {
      _bufferSize = Infinity;
    }
    if (_windowTime === void 0) {
      _windowTime = Infinity;
    }
    if (_timestampProvider === void 0) {
      _timestampProvider = dateTimestampProvider_1$2.dateTimestampProvider;
    }
    var _this = _super.call(this) || this;
    _this._bufferSize = _bufferSize;
    _this._windowTime = _windowTime;
    _this._timestampProvider = _timestampProvider;
    _this._buffer = [];
    _this._infiniteTimeWindow = true;
    _this._infiniteTimeWindow = _windowTime === Infinity;
    _this._bufferSize = Math.max(1, _bufferSize);
    _this._windowTime = Math.max(1, _windowTime);
    return _this;
  }
  ReplaySubject2.prototype.next = function(value) {
    var _a = this, isStopped = _a.isStopped, _buffer = _a._buffer, _infiniteTimeWindow = _a._infiniteTimeWindow, _timestampProvider = _a._timestampProvider, _windowTime = _a._windowTime;
    if (!isStopped) {
      _buffer.push(value);
      !_infiniteTimeWindow && _buffer.push(_timestampProvider.now() + _windowTime);
    }
    this._trimBuffer();
    _super.prototype.next.call(this, value);
  };
  ReplaySubject2.prototype._subscribe = function(subscriber) {
    this._throwIfClosed();
    this._trimBuffer();
    var subscription = this._innerSubscribe(subscriber);
    var _a = this, _infiniteTimeWindow = _a._infiniteTimeWindow, _buffer = _a._buffer;
    var copy = _buffer.slice();
    for (var i = 0; i < copy.length && !subscriber.closed; i += _infiniteTimeWindow ? 1 : 2) {
      subscriber.next(copy[i]);
    }
    this._checkFinalizedStatuses(subscriber);
    return subscription;
  };
  ReplaySubject2.prototype._trimBuffer = function() {
    var _a = this, _bufferSize = _a._bufferSize, _timestampProvider = _a._timestampProvider, _buffer = _a._buffer, _infiniteTimeWindow = _a._infiniteTimeWindow;
    var adjustedBufferSize = (_infiniteTimeWindow ? 1 : 2) * _bufferSize;
    _bufferSize < Infinity && adjustedBufferSize < _buffer.length && _buffer.splice(0, _buffer.length - adjustedBufferSize);
    if (!_infiniteTimeWindow) {
      var now = _timestampProvider.now();
      var last2 = 0;
      for (var i = 1; i < _buffer.length && _buffer[i] <= now; i += 2) {
        last2 = i;
      }
      last2 && _buffer.splice(0, last2 + 1);
    }
  };
  return ReplaySubject2;
}(Subject_1$d.Subject);
ReplaySubject$1.ReplaySubject = ReplaySubject;
var AsyncSubject$1 = {};
var __extends$a = commonjsGlobal && commonjsGlobal.__extends || /* @__PURE__ */ function() {
  var extendStatics = function(d2, b) {
    extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d3, b2) {
      d3.__proto__ = b2;
    } || function(d3, b2) {
      for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d3[p] = b2[p];
    };
    return extendStatics(d2, b);
  };
  return function(d2, b) {
    if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d2, b);
    function __() {
      this.constructor = d2;
    }
    d2.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();
Object.defineProperty(AsyncSubject$1, "__esModule", { value: true });
AsyncSubject$1.AsyncSubject = void 0;
var Subject_1$c = Subject$1;
var AsyncSubject = function(_super) {
  __extends$a(AsyncSubject2, _super);
  function AsyncSubject2() {
    var _this = _super !== null && _super.apply(this, arguments) || this;
    _this._value = null;
    _this._hasValue = false;
    _this._isComplete = false;
    return _this;
  }
  AsyncSubject2.prototype._checkFinalizedStatuses = function(subscriber) {
    var _a = this, hasError = _a.hasError, _hasValue = _a._hasValue, _value = _a._value, thrownError = _a.thrownError, isStopped = _a.isStopped, _isComplete = _a._isComplete;
    if (hasError) {
      subscriber.error(thrownError);
    } else if (isStopped || _isComplete) {
      _hasValue && subscriber.next(_value);
      subscriber.complete();
    }
  };
  AsyncSubject2.prototype.next = function(value) {
    if (!this.isStopped) {
      this._value = value;
      this._hasValue = true;
    }
  };
  AsyncSubject2.prototype.complete = function() {
    var _a = this, _hasValue = _a._hasValue, _value = _a._value, _isComplete = _a._isComplete;
    if (!_isComplete) {
      this._isComplete = true;
      _hasValue && _super.prototype.next.call(this, _value);
      _super.prototype.complete.call(this);
    }
  };
  return AsyncSubject2;
}(Subject_1$c.Subject);
AsyncSubject$1.AsyncSubject = AsyncSubject;
var asap = {};
var AsapAction$1 = {};
var AsyncAction$1 = {};
var Action$1 = {};
var __extends$9 = commonjsGlobal && commonjsGlobal.__extends || /* @__PURE__ */ function() {
  var extendStatics = function(d2, b) {
    extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d3, b2) {
      d3.__proto__ = b2;
    } || function(d3, b2) {
      for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d3[p] = b2[p];
    };
    return extendStatics(d2, b);
  };
  return function(d2, b) {
    if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d2, b);
    function __() {
      this.constructor = d2;
    }
    d2.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();
Object.defineProperty(Action$1, "__esModule", { value: true });
Action$1.Action = void 0;
var Subscription_1$5 = Subscription$1;
var Action = function(_super) {
  __extends$9(Action2, _super);
  function Action2(scheduler, work) {
    return _super.call(this) || this;
  }
  Action2.prototype.schedule = function(state, delay2) {
    return this;
  };
  return Action2;
}(Subscription_1$5.Subscription);
Action$1.Action = Action;
var intervalProvider = {};
(function(exports) {
  var __read2 = commonjsGlobal && commonjsGlobal.__read || function(o, n2) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n2 === void 0 || n2-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
  var __spreadArray2 = commonjsGlobal && commonjsGlobal.__spreadArray || function(to, from2) {
    for (var i = 0, il = from2.length, j2 = to.length; i < il; i++, j2++)
      to[j2] = from2[i];
    return to;
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.intervalProvider = void 0;
  exports.intervalProvider = {
    setInterval: function(handler, timeout2) {
      var args2 = [];
      for (var _i = 2; _i < arguments.length; _i++) {
        args2[_i - 2] = arguments[_i];
      }
      var delegate = exports.intervalProvider.delegate;
      if (delegate === null || delegate === void 0 ? void 0 : delegate.setInterval) {
        return delegate.setInterval.apply(delegate, __spreadArray2([handler, timeout2], __read2(args2)));
      }
      return setInterval.apply(void 0, __spreadArray2([handler, timeout2], __read2(args2)));
    },
    clearInterval: function(handle) {
      var delegate = exports.intervalProvider.delegate;
      return ((delegate === null || delegate === void 0 ? void 0 : delegate.clearInterval) || clearInterval)(handle);
    },
    delegate: void 0
  };
})(intervalProvider);
var __extends$8 = commonjsGlobal && commonjsGlobal.__extends || /* @__PURE__ */ function() {
  var extendStatics = function(d2, b) {
    extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d3, b2) {
      d3.__proto__ = b2;
    } || function(d3, b2) {
      for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d3[p] = b2[p];
    };
    return extendStatics(d2, b);
  };
  return function(d2, b) {
    if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d2, b);
    function __() {
      this.constructor = d2;
    }
    d2.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();
Object.defineProperty(AsyncAction$1, "__esModule", { value: true });
AsyncAction$1.AsyncAction = void 0;
var Action_1 = Action$1;
var intervalProvider_1 = intervalProvider;
var arrRemove_1$5 = arrRemove$1;
var AsyncAction = function(_super) {
  __extends$8(AsyncAction2, _super);
  function AsyncAction2(scheduler, work) {
    var _this = _super.call(this, scheduler, work) || this;
    _this.scheduler = scheduler;
    _this.work = work;
    _this.pending = false;
    return _this;
  }
  AsyncAction2.prototype.schedule = function(state, delay2) {
    var _a;
    if (delay2 === void 0) {
      delay2 = 0;
    }
    if (this.closed) {
      return this;
    }
    this.state = state;
    var id = this.id;
    var scheduler = this.scheduler;
    if (id != null) {
      this.id = this.recycleAsyncId(scheduler, id, delay2);
    }
    this.pending = true;
    this.delay = delay2;
    this.id = (_a = this.id) !== null && _a !== void 0 ? _a : this.requestAsyncId(scheduler, this.id, delay2);
    return this;
  };
  AsyncAction2.prototype.requestAsyncId = function(scheduler, _id, delay2) {
    if (delay2 === void 0) {
      delay2 = 0;
    }
    return intervalProvider_1.intervalProvider.setInterval(scheduler.flush.bind(scheduler, this), delay2);
  };
  AsyncAction2.prototype.recycleAsyncId = function(_scheduler, id, delay2) {
    if (delay2 === void 0) {
      delay2 = 0;
    }
    if (delay2 != null && this.delay === delay2 && this.pending === false) {
      return id;
    }
    if (id != null) {
      intervalProvider_1.intervalProvider.clearInterval(id);
    }
    return void 0;
  };
  AsyncAction2.prototype.execute = function(state, delay2) {
    if (this.closed) {
      return new Error("executing a cancelled action");
    }
    this.pending = false;
    var error = this._execute(state, delay2);
    if (error) {
      return error;
    } else if (this.pending === false && this.id != null) {
      this.id = this.recycleAsyncId(this.scheduler, this.id, null);
    }
  };
  AsyncAction2.prototype._execute = function(state, _delay) {
    var errored = false;
    var errorValue;
    try {
      this.work(state);
    } catch (e) {
      errored = true;
      errorValue = e ? e : new Error("Scheduled action threw falsy error");
    }
    if (errored) {
      this.unsubscribe();
      return errorValue;
    }
  };
  AsyncAction2.prototype.unsubscribe = function() {
    if (!this.closed) {
      var _a = this, id = _a.id, scheduler = _a.scheduler;
      var actions = scheduler.actions;
      this.work = this.state = this.scheduler = null;
      this.pending = false;
      arrRemove_1$5.arrRemove(actions, this);
      if (id != null) {
        this.id = this.recycleAsyncId(scheduler, id, null);
      }
      this.delay = null;
      _super.prototype.unsubscribe.call(this);
    }
  };
  return AsyncAction2;
}(Action_1.Action);
AsyncAction$1.AsyncAction = AsyncAction;
var immediateProvider = {};
var Immediate = {};
Object.defineProperty(Immediate, "__esModule", { value: true });
Immediate.TestTools = Immediate.Immediate = void 0;
var nextHandle = 1;
var resolved;
var activeHandles = {};
function findAndClearHandle(handle) {
  if (handle in activeHandles) {
    delete activeHandles[handle];
    return true;
  }
  return false;
}
Immediate.Immediate = {
  setImmediate: function(cb) {
    var handle = nextHandle++;
    activeHandles[handle] = true;
    if (!resolved) {
      resolved = Promise.resolve();
    }
    resolved.then(function() {
      return findAndClearHandle(handle) && cb();
    });
    return handle;
  },
  clearImmediate: function(handle) {
    findAndClearHandle(handle);
  }
};
Immediate.TestTools = {
  pending: function() {
    return Object.keys(activeHandles).length;
  }
};
(function(exports) {
  var __read2 = commonjsGlobal && commonjsGlobal.__read || function(o, n2) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n2 === void 0 || n2-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
  var __spreadArray2 = commonjsGlobal && commonjsGlobal.__spreadArray || function(to, from2) {
    for (var i = 0, il = from2.length, j2 = to.length; i < il; i++, j2++)
      to[j2] = from2[i];
    return to;
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.immediateProvider = void 0;
  var Immediate_1 = Immediate;
  var setImmediate = Immediate_1.Immediate.setImmediate, clearImmediate = Immediate_1.Immediate.clearImmediate;
  exports.immediateProvider = {
    setImmediate: function() {
      var args2 = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args2[_i] = arguments[_i];
      }
      var delegate = exports.immediateProvider.delegate;
      return ((delegate === null || delegate === void 0 ? void 0 : delegate.setImmediate) || setImmediate).apply(void 0, __spreadArray2([], __read2(args2)));
    },
    clearImmediate: function(handle) {
      var delegate = exports.immediateProvider.delegate;
      return ((delegate === null || delegate === void 0 ? void 0 : delegate.clearImmediate) || clearImmediate)(handle);
    },
    delegate: void 0
  };
})(immediateProvider);
var __extends$7 = commonjsGlobal && commonjsGlobal.__extends || /* @__PURE__ */ function() {
  var extendStatics = function(d2, b) {
    extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d3, b2) {
      d3.__proto__ = b2;
    } || function(d3, b2) {
      for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d3[p] = b2[p];
    };
    return extendStatics(d2, b);
  };
  return function(d2, b) {
    if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d2, b);
    function __() {
      this.constructor = d2;
    }
    d2.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();
Object.defineProperty(AsapAction$1, "__esModule", { value: true });
AsapAction$1.AsapAction = void 0;
var AsyncAction_1$3 = AsyncAction$1;
var immediateProvider_1 = immediateProvider;
var AsapAction = function(_super) {
  __extends$7(AsapAction2, _super);
  function AsapAction2(scheduler, work) {
    var _this = _super.call(this, scheduler, work) || this;
    _this.scheduler = scheduler;
    _this.work = work;
    return _this;
  }
  AsapAction2.prototype.requestAsyncId = function(scheduler, id, delay2) {
    if (delay2 === void 0) {
      delay2 = 0;
    }
    if (delay2 !== null && delay2 > 0) {
      return _super.prototype.requestAsyncId.call(this, scheduler, id, delay2);
    }
    scheduler.actions.push(this);
    return scheduler._scheduled || (scheduler._scheduled = immediateProvider_1.immediateProvider.setImmediate(scheduler.flush.bind(scheduler, void 0)));
  };
  AsapAction2.prototype.recycleAsyncId = function(scheduler, id, delay2) {
    var _a;
    if (delay2 === void 0) {
      delay2 = 0;
    }
    if (delay2 != null ? delay2 > 0 : this.delay > 0) {
      return _super.prototype.recycleAsyncId.call(this, scheduler, id, delay2);
    }
    var actions = scheduler.actions;
    if (id != null && ((_a = actions[actions.length - 1]) === null || _a === void 0 ? void 0 : _a.id) !== id) {
      immediateProvider_1.immediateProvider.clearImmediate(id);
      if (scheduler._scheduled === id) {
        scheduler._scheduled = void 0;
      }
    }
    return void 0;
  };
  return AsapAction2;
}(AsyncAction_1$3.AsyncAction);
AsapAction$1.AsapAction = AsapAction;
var AsapScheduler$1 = {};
var AsyncScheduler$1 = {};
var Scheduler$1 = {};
Object.defineProperty(Scheduler$1, "__esModule", { value: true });
Scheduler$1.Scheduler = void 0;
var dateTimestampProvider_1$1 = dateTimestampProvider;
var Scheduler = function() {
  function Scheduler2(schedulerActionCtor, now) {
    if (now === void 0) {
      now = Scheduler2.now;
    }
    this.schedulerActionCtor = schedulerActionCtor;
    this.now = now;
  }
  Scheduler2.prototype.schedule = function(work, delay2, state) {
    if (delay2 === void 0) {
      delay2 = 0;
    }
    return new this.schedulerActionCtor(this, work).schedule(state, delay2);
  };
  Scheduler2.now = dateTimestampProvider_1$1.dateTimestampProvider.now;
  return Scheduler2;
}();
Scheduler$1.Scheduler = Scheduler;
var __extends$6 = commonjsGlobal && commonjsGlobal.__extends || /* @__PURE__ */ function() {
  var extendStatics = function(d2, b) {
    extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d3, b2) {
      d3.__proto__ = b2;
    } || function(d3, b2) {
      for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d3[p] = b2[p];
    };
    return extendStatics(d2, b);
  };
  return function(d2, b) {
    if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d2, b);
    function __() {
      this.constructor = d2;
    }
    d2.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();
Object.defineProperty(AsyncScheduler$1, "__esModule", { value: true });
AsyncScheduler$1.AsyncScheduler = void 0;
var Scheduler_1 = Scheduler$1;
var AsyncScheduler = function(_super) {
  __extends$6(AsyncScheduler2, _super);
  function AsyncScheduler2(SchedulerAction, now) {
    if (now === void 0) {
      now = Scheduler_1.Scheduler.now;
    }
    var _this = _super.call(this, SchedulerAction, now) || this;
    _this.actions = [];
    _this._active = false;
    return _this;
  }
  AsyncScheduler2.prototype.flush = function(action) {
    var actions = this.actions;
    if (this._active) {
      actions.push(action);
      return;
    }
    var error;
    this._active = true;
    do {
      if (error = action.execute(action.state, action.delay)) {
        break;
      }
    } while (action = actions.shift());
    this._active = false;
    if (error) {
      while (action = actions.shift()) {
        action.unsubscribe();
      }
      throw error;
    }
  };
  return AsyncScheduler2;
}(Scheduler_1.Scheduler);
AsyncScheduler$1.AsyncScheduler = AsyncScheduler;
var __extends$5 = commonjsGlobal && commonjsGlobal.__extends || /* @__PURE__ */ function() {
  var extendStatics = function(d2, b) {
    extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d3, b2) {
      d3.__proto__ = b2;
    } || function(d3, b2) {
      for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d3[p] = b2[p];
    };
    return extendStatics(d2, b);
  };
  return function(d2, b) {
    if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d2, b);
    function __() {
      this.constructor = d2;
    }
    d2.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();
Object.defineProperty(AsapScheduler$1, "__esModule", { value: true });
AsapScheduler$1.AsapScheduler = void 0;
var AsyncScheduler_1$3 = AsyncScheduler$1;
var AsapScheduler = function(_super) {
  __extends$5(AsapScheduler2, _super);
  function AsapScheduler2() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  AsapScheduler2.prototype.flush = function(action) {
    this._active = true;
    var flushId = this._scheduled;
    this._scheduled = void 0;
    var actions = this.actions;
    var error;
    action = action || actions.shift();
    do {
      if (error = action.execute(action.state, action.delay)) {
        break;
      }
    } while ((action = actions[0]) && action.id === flushId && actions.shift());
    this._active = false;
    if (error) {
      while ((action = actions[0]) && action.id === flushId && actions.shift()) {
        action.unsubscribe();
      }
      throw error;
    }
  };
  return AsapScheduler2;
}(AsyncScheduler_1$3.AsyncScheduler);
AsapScheduler$1.AsapScheduler = AsapScheduler;
(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.asap = exports.asapScheduler = void 0;
  var AsapAction_1 = AsapAction$1;
  var AsapScheduler_1 = AsapScheduler$1;
  exports.asapScheduler = new AsapScheduler_1.AsapScheduler(AsapAction_1.AsapAction);
  exports.asap = exports.asapScheduler;
})(asap);
var async = {};
(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.async = exports.asyncScheduler = void 0;
  var AsyncAction_12 = AsyncAction$1;
  var AsyncScheduler_12 = AsyncScheduler$1;
  exports.asyncScheduler = new AsyncScheduler_12.AsyncScheduler(AsyncAction_12.AsyncAction);
  exports.async = exports.asyncScheduler;
})(async);
var queue = {};
var QueueAction$1 = {};
var __extends$4 = commonjsGlobal && commonjsGlobal.__extends || /* @__PURE__ */ function() {
  var extendStatics = function(d2, b) {
    extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d3, b2) {
      d3.__proto__ = b2;
    } || function(d3, b2) {
      for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d3[p] = b2[p];
    };
    return extendStatics(d2, b);
  };
  return function(d2, b) {
    if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d2, b);
    function __() {
      this.constructor = d2;
    }
    d2.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();
Object.defineProperty(QueueAction$1, "__esModule", { value: true });
QueueAction$1.QueueAction = void 0;
var AsyncAction_1$2 = AsyncAction$1;
var QueueAction = function(_super) {
  __extends$4(QueueAction2, _super);
  function QueueAction2(scheduler, work) {
    var _this = _super.call(this, scheduler, work) || this;
    _this.scheduler = scheduler;
    _this.work = work;
    return _this;
  }
  QueueAction2.prototype.schedule = function(state, delay2) {
    if (delay2 === void 0) {
      delay2 = 0;
    }
    if (delay2 > 0) {
      return _super.prototype.schedule.call(this, state, delay2);
    }
    this.delay = delay2;
    this.state = state;
    this.scheduler.flush(this);
    return this;
  };
  QueueAction2.prototype.execute = function(state, delay2) {
    return delay2 > 0 || this.closed ? _super.prototype.execute.call(this, state, delay2) : this._execute(state, delay2);
  };
  QueueAction2.prototype.requestAsyncId = function(scheduler, id, delay2) {
    if (delay2 === void 0) {
      delay2 = 0;
    }
    if (delay2 != null && delay2 > 0 || delay2 == null && this.delay > 0) {
      return _super.prototype.requestAsyncId.call(this, scheduler, id, delay2);
    }
    scheduler.flush(this);
    return 0;
  };
  return QueueAction2;
}(AsyncAction_1$2.AsyncAction);
QueueAction$1.QueueAction = QueueAction;
var QueueScheduler$1 = {};
var __extends$3 = commonjsGlobal && commonjsGlobal.__extends || /* @__PURE__ */ function() {
  var extendStatics = function(d2, b) {
    extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d3, b2) {
      d3.__proto__ = b2;
    } || function(d3, b2) {
      for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d3[p] = b2[p];
    };
    return extendStatics(d2, b);
  };
  return function(d2, b) {
    if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d2, b);
    function __() {
      this.constructor = d2;
    }
    d2.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();
Object.defineProperty(QueueScheduler$1, "__esModule", { value: true });
QueueScheduler$1.QueueScheduler = void 0;
var AsyncScheduler_1$2 = AsyncScheduler$1;
var QueueScheduler = function(_super) {
  __extends$3(QueueScheduler2, _super);
  function QueueScheduler2() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  return QueueScheduler2;
}(AsyncScheduler_1$2.AsyncScheduler);
QueueScheduler$1.QueueScheduler = QueueScheduler;
(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.queue = exports.queueScheduler = void 0;
  var QueueAction_1 = QueueAction$1;
  var QueueScheduler_1 = QueueScheduler$1;
  exports.queueScheduler = new QueueScheduler_1.QueueScheduler(QueueAction_1.QueueAction);
  exports.queue = exports.queueScheduler;
})(queue);
var animationFrame = {};
var AnimationFrameAction$1 = {};
var __extends$2 = commonjsGlobal && commonjsGlobal.__extends || /* @__PURE__ */ function() {
  var extendStatics = function(d2, b) {
    extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d3, b2) {
      d3.__proto__ = b2;
    } || function(d3, b2) {
      for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d3[p] = b2[p];
    };
    return extendStatics(d2, b);
  };
  return function(d2, b) {
    if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d2, b);
    function __() {
      this.constructor = d2;
    }
    d2.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();
Object.defineProperty(AnimationFrameAction$1, "__esModule", { value: true });
AnimationFrameAction$1.AnimationFrameAction = void 0;
var AsyncAction_1$1 = AsyncAction$1;
var animationFrameProvider_1 = animationFrameProvider;
var AnimationFrameAction = function(_super) {
  __extends$2(AnimationFrameAction2, _super);
  function AnimationFrameAction2(scheduler, work) {
    var _this = _super.call(this, scheduler, work) || this;
    _this.scheduler = scheduler;
    _this.work = work;
    return _this;
  }
  AnimationFrameAction2.prototype.requestAsyncId = function(scheduler, id, delay2) {
    if (delay2 === void 0) {
      delay2 = 0;
    }
    if (delay2 !== null && delay2 > 0) {
      return _super.prototype.requestAsyncId.call(this, scheduler, id, delay2);
    }
    scheduler.actions.push(this);
    return scheduler._scheduled || (scheduler._scheduled = animationFrameProvider_1.animationFrameProvider.requestAnimationFrame(function() {
      return scheduler.flush(void 0);
    }));
  };
  AnimationFrameAction2.prototype.recycleAsyncId = function(scheduler, id, delay2) {
    var _a;
    if (delay2 === void 0) {
      delay2 = 0;
    }
    if (delay2 != null ? delay2 > 0 : this.delay > 0) {
      return _super.prototype.recycleAsyncId.call(this, scheduler, id, delay2);
    }
    var actions = scheduler.actions;
    if (id != null && ((_a = actions[actions.length - 1]) === null || _a === void 0 ? void 0 : _a.id) !== id) {
      animationFrameProvider_1.animationFrameProvider.cancelAnimationFrame(id);
      scheduler._scheduled = void 0;
    }
    return void 0;
  };
  return AnimationFrameAction2;
}(AsyncAction_1$1.AsyncAction);
AnimationFrameAction$1.AnimationFrameAction = AnimationFrameAction;
var AnimationFrameScheduler$1 = {};
var __extends$1 = commonjsGlobal && commonjsGlobal.__extends || /* @__PURE__ */ function() {
  var extendStatics = function(d2, b) {
    extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d3, b2) {
      d3.__proto__ = b2;
    } || function(d3, b2) {
      for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d3[p] = b2[p];
    };
    return extendStatics(d2, b);
  };
  return function(d2, b) {
    if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d2, b);
    function __() {
      this.constructor = d2;
    }
    d2.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();
Object.defineProperty(AnimationFrameScheduler$1, "__esModule", { value: true });
AnimationFrameScheduler$1.AnimationFrameScheduler = void 0;
var AsyncScheduler_1$1 = AsyncScheduler$1;
var AnimationFrameScheduler = function(_super) {
  __extends$1(AnimationFrameScheduler2, _super);
  function AnimationFrameScheduler2() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  AnimationFrameScheduler2.prototype.flush = function(action) {
    this._active = true;
    var flushId = this._scheduled;
    this._scheduled = void 0;
    var actions = this.actions;
    var error;
    action = action || actions.shift();
    do {
      if (error = action.execute(action.state, action.delay)) {
        break;
      }
    } while ((action = actions[0]) && action.id === flushId && actions.shift());
    this._active = false;
    if (error) {
      while ((action = actions[0]) && action.id === flushId && actions.shift()) {
        action.unsubscribe();
      }
      throw error;
    }
  };
  return AnimationFrameScheduler2;
}(AsyncScheduler_1$1.AsyncScheduler);
AnimationFrameScheduler$1.AnimationFrameScheduler = AnimationFrameScheduler;
(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.animationFrame = exports.animationFrameScheduler = void 0;
  var AnimationFrameAction_1 = AnimationFrameAction$1;
  var AnimationFrameScheduler_1 = AnimationFrameScheduler$1;
  exports.animationFrameScheduler = new AnimationFrameScheduler_1.AnimationFrameScheduler(AnimationFrameAction_1.AnimationFrameAction);
  exports.animationFrame = exports.animationFrameScheduler;
})(animationFrame);
var VirtualTimeScheduler$1 = {};
var __extends = commonjsGlobal && commonjsGlobal.__extends || /* @__PURE__ */ function() {
  var extendStatics = function(d2, b) {
    extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d3, b2) {
      d3.__proto__ = b2;
    } || function(d3, b2) {
      for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d3[p] = b2[p];
    };
    return extendStatics(d2, b);
  };
  return function(d2, b) {
    if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d2, b);
    function __() {
      this.constructor = d2;
    }
    d2.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();
Object.defineProperty(VirtualTimeScheduler$1, "__esModule", { value: true });
VirtualTimeScheduler$1.VirtualAction = VirtualTimeScheduler$1.VirtualTimeScheduler = void 0;
var AsyncAction_1 = AsyncAction$1;
var Subscription_1$4 = Subscription$1;
var AsyncScheduler_1 = AsyncScheduler$1;
var VirtualTimeScheduler = function(_super) {
  __extends(VirtualTimeScheduler2, _super);
  function VirtualTimeScheduler2(schedulerActionCtor, maxFrames) {
    if (schedulerActionCtor === void 0) {
      schedulerActionCtor = VirtualAction;
    }
    if (maxFrames === void 0) {
      maxFrames = Infinity;
    }
    var _this = _super.call(this, schedulerActionCtor, function() {
      return _this.frame;
    }) || this;
    _this.maxFrames = maxFrames;
    _this.frame = 0;
    _this.index = -1;
    return _this;
  }
  VirtualTimeScheduler2.prototype.flush = function() {
    var _a = this, actions = _a.actions, maxFrames = _a.maxFrames;
    var error;
    var action;
    while ((action = actions[0]) && action.delay <= maxFrames) {
      actions.shift();
      this.frame = action.delay;
      if (error = action.execute(action.state, action.delay)) {
        break;
      }
    }
    if (error) {
      while (action = actions.shift()) {
        action.unsubscribe();
      }
      throw error;
    }
  };
  VirtualTimeScheduler2.frameTimeFactor = 10;
  return VirtualTimeScheduler2;
}(AsyncScheduler_1.AsyncScheduler);
VirtualTimeScheduler$1.VirtualTimeScheduler = VirtualTimeScheduler;
var VirtualAction = function(_super) {
  __extends(VirtualAction2, _super);
  function VirtualAction2(scheduler, work, index) {
    if (index === void 0) {
      index = scheduler.index += 1;
    }
    var _this = _super.call(this, scheduler, work) || this;
    _this.scheduler = scheduler;
    _this.work = work;
    _this.index = index;
    _this.active = true;
    _this.index = scheduler.index = index;
    return _this;
  }
  VirtualAction2.prototype.schedule = function(state, delay2) {
    if (delay2 === void 0) {
      delay2 = 0;
    }
    if (Number.isFinite(delay2)) {
      if (!this.id) {
        return _super.prototype.schedule.call(this, state, delay2);
      }
      this.active = false;
      var action = new VirtualAction2(this.scheduler, this.work);
      this.add(action);
      return action.schedule(state, delay2);
    } else {
      return Subscription_1$4.Subscription.EMPTY;
    }
  };
  VirtualAction2.prototype.requestAsyncId = function(scheduler, id, delay2) {
    if (delay2 === void 0) {
      delay2 = 0;
    }
    this.delay = scheduler.frame + delay2;
    var actions = scheduler.actions;
    actions.push(this);
    actions.sort(VirtualAction2.sortActions);
    return 1;
  };
  VirtualAction2.prototype.recycleAsyncId = function(scheduler, id, delay2) {
    return void 0;
  };
  VirtualAction2.prototype._execute = function(state, delay2) {
    if (this.active === true) {
      return _super.prototype._execute.call(this, state, delay2);
    }
  };
  VirtualAction2.sortActions = function(a, b) {
    if (a.delay === b.delay) {
      if (a.index === b.index) {
        return 0;
      } else if (a.index > b.index) {
        return 1;
      } else {
        return -1;
      }
    } else if (a.delay > b.delay) {
      return 1;
    } else {
      return -1;
    }
  };
  return VirtualAction2;
}(AsyncAction_1.AsyncAction);
VirtualTimeScheduler$1.VirtualAction = VirtualAction;
var Notification = {};
var empty = {};
(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.empty = exports.EMPTY = void 0;
  var Observable_12 = Observable$1;
  exports.EMPTY = new Observable_12.Observable(function(subscriber) {
    return subscriber.complete();
  });
  function empty2(scheduler) {
    return scheduler ? emptyScheduled(scheduler) : exports.EMPTY;
  }
  exports.empty = empty2;
  function emptyScheduled(scheduler) {
    return new Observable_12.Observable(function(subscriber) {
      return scheduler.schedule(function() {
        return subscriber.complete();
      });
    });
  }
})(empty);
var of$1 = {};
var args = {};
var isScheduler$1 = {};
Object.defineProperty(isScheduler$1, "__esModule", { value: true });
isScheduler$1.isScheduler = void 0;
var isFunction_1$m = isFunction$1;
function isScheduler(value) {
  return value && isFunction_1$m.isFunction(value.schedule);
}
isScheduler$1.isScheduler = isScheduler;
Object.defineProperty(args, "__esModule", { value: true });
args.popNumber = args.popScheduler = args.popResultSelector = void 0;
var isFunction_1$l = isFunction$1;
var isScheduler_1$3 = isScheduler$1;
function last$2(arr) {
  return arr[arr.length - 1];
}
function popResultSelector(args2) {
  return isFunction_1$l.isFunction(last$2(args2)) ? args2.pop() : void 0;
}
args.popResultSelector = popResultSelector;
function popScheduler(args2) {
  return isScheduler_1$3.isScheduler(last$2(args2)) ? args2.pop() : void 0;
}
args.popScheduler = popScheduler;
function popNumber(args2, defaultValue) {
  return typeof last$2(args2) === "number" ? args2.pop() : defaultValue;
}
args.popNumber = popNumber;
var from$1 = {};
var scheduled$1 = {};
var scheduleObservable$1 = {};
var innerFrom$1 = {};
var isArrayLike = {};
Object.defineProperty(isArrayLike, "__esModule", { value: true });
isArrayLike.isArrayLike = void 0;
isArrayLike.isArrayLike = function(x2) {
  return x2 && typeof x2.length === "number" && typeof x2 !== "function";
};
var isPromise$1 = {};
Object.defineProperty(isPromise$1, "__esModule", { value: true });
isPromise$1.isPromise = void 0;
var isFunction_1$k = isFunction$1;
function isPromise(value) {
  return isFunction_1$k.isFunction(value === null || value === void 0 ? void 0 : value.then);
}
isPromise$1.isPromise = isPromise;
var isInteropObservable$1 = {};
Object.defineProperty(isInteropObservable$1, "__esModule", { value: true });
isInteropObservable$1.isInteropObservable = void 0;
var observable_1$1 = observable;
var isFunction_1$j = isFunction$1;
function isInteropObservable(input) {
  return isFunction_1$j.isFunction(input[observable_1$1.observable]);
}
isInteropObservable$1.isInteropObservable = isInteropObservable;
var isAsyncIterable$1 = {};
Object.defineProperty(isAsyncIterable$1, "__esModule", { value: true });
isAsyncIterable$1.isAsyncIterable = void 0;
var isFunction_1$i = isFunction$1;
function isAsyncIterable(obj) {
  return Symbol.asyncIterator && isFunction_1$i.isFunction(obj === null || obj === void 0 ? void 0 : obj[Symbol.asyncIterator]);
}
isAsyncIterable$1.isAsyncIterable = isAsyncIterable;
var throwUnobservableError = {};
Object.defineProperty(throwUnobservableError, "__esModule", { value: true });
throwUnobservableError.createInvalidObservableTypeError = void 0;
function createInvalidObservableTypeError(input) {
  return new TypeError("You provided " + (input !== null && typeof input === "object" ? "an invalid object" : "'" + input + "'") + " where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.");
}
throwUnobservableError.createInvalidObservableTypeError = createInvalidObservableTypeError;
var isIterable$1 = {};
var iterator = {};
Object.defineProperty(iterator, "__esModule", { value: true });
iterator.iterator = iterator.getSymbolIterator = void 0;
function getSymbolIterator() {
  if (typeof Symbol !== "function" || !Symbol.iterator) {
    return "@@iterator";
  }
  return Symbol.iterator;
}
iterator.getSymbolIterator = getSymbolIterator;
iterator.iterator = getSymbolIterator();
Object.defineProperty(isIterable$1, "__esModule", { value: true });
isIterable$1.isIterable = void 0;
var iterator_1$1 = iterator;
var isFunction_1$h = isFunction$1;
function isIterable(input) {
  return isFunction_1$h.isFunction(input === null || input === void 0 ? void 0 : input[iterator_1$1.iterator]);
}
isIterable$1.isIterable = isIterable;
var isReadableStreamLike$1 = {};
var __generator$2 = commonjsGlobal && commonjsGlobal.__generator || function(thisArg, body) {
  var _ = { label: 0, sent: function() {
    if (t[0] & 1) throw t[1];
    return t[1];
  }, trys: [], ops: [] }, f, y2, t, g2;
  return g2 = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g2[Symbol.iterator] = function() {
    return this;
  }), g2;
  function verb(n2) {
    return function(v) {
      return step([n2, v]);
    };
  }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (_) try {
      if (f = 1, y2 && (t = op[0] & 2 ? y2["return"] : op[0] ? y2["throw"] || ((t = y2["return"]) && t.call(y2), 0) : y2.next) && !(t = t.call(y2, op[1])).done) return t;
      if (y2 = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;
        case 4:
          _.label++;
          return { value: op[1], done: false };
        case 5:
          _.label++;
          y2 = op[1];
          op = [0];
          continue;
        case 7:
          op = _.ops.pop();
          _.trys.pop();
          continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }
          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }
          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }
          if (t && _.label < t[2]) {
            _.label = t[2];
            _.ops.push(op);
            break;
          }
          if (t[2]) _.ops.pop();
          _.trys.pop();
          continue;
      }
      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y2 = 0;
    } finally {
      f = t = 0;
    }
    if (op[0] & 5) throw op[1];
    return { value: op[0] ? op[1] : void 0, done: true };
  }
};
var __await = commonjsGlobal && commonjsGlobal.__await || function(v) {
  return this instanceof __await ? (this.v = v, this) : new __await(v);
};
var __asyncGenerator = commonjsGlobal && commonjsGlobal.__asyncGenerator || function(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var g2 = generator.apply(thisArg, _arguments || []), i, q = [];
  return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
    return this;
  }, i;
  function verb(n2) {
    if (g2[n2]) i[n2] = function(v) {
      return new Promise(function(a, b) {
        q.push([n2, v, a, b]) > 1 || resume(n2, v);
      });
    };
  }
  function resume(n2, v) {
    try {
      step(g2[n2](v));
    } catch (e) {
      settle(q[0][3], e);
    }
  }
  function step(r) {
    r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
  }
  function fulfill(value) {
    resume("next", value);
  }
  function reject(value) {
    resume("throw", value);
  }
  function settle(f, v) {
    if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
  }
};
Object.defineProperty(isReadableStreamLike$1, "__esModule", { value: true });
isReadableStreamLike$1.isReadableStreamLike = isReadableStreamLike$1.readableStreamLikeToAsyncGenerator = void 0;
var isFunction_1$g = isFunction$1;
function readableStreamLikeToAsyncGenerator(readableStream) {
  return __asyncGenerator(this, arguments, function readableStreamLikeToAsyncGenerator_1() {
    var reader, _a, value, done;
    return __generator$2(this, function(_b) {
      switch (_b.label) {
        case 0:
          reader = readableStream.getReader();
          _b.label = 1;
        case 1:
          _b.trys.push([1, , 9, 10]);
          _b.label = 2;
        case 2:
          return [4, __await(reader.read())];
        case 3:
          _a = _b.sent(), value = _a.value, done = _a.done;
          if (!done) return [3, 5];
          return [4, __await(void 0)];
        case 4:
          return [2, _b.sent()];
        case 5:
          return [4, __await(value)];
        case 6:
          return [4, _b.sent()];
        case 7:
          _b.sent();
          return [3, 2];
        case 8:
          return [3, 10];
        case 9:
          reader.releaseLock();
          return [7];
        case 10:
          return [2];
      }
    });
  });
}
isReadableStreamLike$1.readableStreamLikeToAsyncGenerator = readableStreamLikeToAsyncGenerator;
function isReadableStreamLike(obj) {
  return isFunction_1$g.isFunction(obj === null || obj === void 0 ? void 0 : obj.getReader);
}
isReadableStreamLike$1.isReadableStreamLike = isReadableStreamLike;
var __awaiter = commonjsGlobal && commonjsGlobal.__awaiter || function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __generator$1 = commonjsGlobal && commonjsGlobal.__generator || function(thisArg, body) {
  var _ = { label: 0, sent: function() {
    if (t[0] & 1) throw t[1];
    return t[1];
  }, trys: [], ops: [] }, f, y2, t, g2;
  return g2 = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g2[Symbol.iterator] = function() {
    return this;
  }), g2;
  function verb(n2) {
    return function(v) {
      return step([n2, v]);
    };
  }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (_) try {
      if (f = 1, y2 && (t = op[0] & 2 ? y2["return"] : op[0] ? y2["throw"] || ((t = y2["return"]) && t.call(y2), 0) : y2.next) && !(t = t.call(y2, op[1])).done) return t;
      if (y2 = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;
        case 4:
          _.label++;
          return { value: op[1], done: false };
        case 5:
          _.label++;
          y2 = op[1];
          op = [0];
          continue;
        case 7:
          op = _.ops.pop();
          _.trys.pop();
          continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }
          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }
          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }
          if (t && _.label < t[2]) {
            _.label = t[2];
            _.ops.push(op);
            break;
          }
          if (t[2]) _.ops.pop();
          _.trys.pop();
          continue;
      }
      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y2 = 0;
    } finally {
      f = t = 0;
    }
    if (op[0] & 5) throw op[1];
    return { value: op[0] ? op[1] : void 0, done: true };
  }
};
var __asyncValues = commonjsGlobal && commonjsGlobal.__asyncValues || function(o) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator], i;
  return m ? m.call(o) : (o = typeof __values$6 === "function" ? __values$6(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
    return this;
  }, i);
  function verb(n2) {
    i[n2] = o[n2] && function(v) {
      return new Promise(function(resolve, reject) {
        v = o[n2](v), settle(resolve, reject, v.done, v.value);
      });
    };
  }
  function settle(resolve, reject, d2, v) {
    Promise.resolve(v).then(function(v2) {
      resolve({ value: v2, done: d2 });
    }, reject);
  }
};
var __values$6 = commonjsGlobal && commonjsGlobal.__values || function(o) {
  var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
    next: function() {
      if (o && i >= o.length) o = void 0;
      return { value: o && o[i++], done: !o };
    }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(innerFrom$1, "__esModule", { value: true });
innerFrom$1.fromReadableStreamLike = innerFrom$1.fromAsyncIterable = innerFrom$1.fromIterable = innerFrom$1.fromPromise = innerFrom$1.fromArrayLike = innerFrom$1.fromInteropObservable = innerFrom$1.innerFrom = void 0;
var isArrayLike_1$2 = isArrayLike;
var isPromise_1$1 = isPromise$1;
var Observable_1$k = Observable$1;
var isInteropObservable_1$1 = isInteropObservable$1;
var isAsyncIterable_1$1 = isAsyncIterable$1;
var throwUnobservableError_1$1 = throwUnobservableError;
var isIterable_1$1 = isIterable$1;
var isReadableStreamLike_1$2 = isReadableStreamLike$1;
var isFunction_1$f = isFunction$1;
var reportUnhandledError_1 = reportUnhandledError$1;
var observable_1 = observable;
function innerFrom(input) {
  if (input instanceof Observable_1$k.Observable) {
    return input;
  }
  if (input != null) {
    if (isInteropObservable_1$1.isInteropObservable(input)) {
      return fromInteropObservable(input);
    }
    if (isArrayLike_1$2.isArrayLike(input)) {
      return fromArrayLike(input);
    }
    if (isPromise_1$1.isPromise(input)) {
      return fromPromise(input);
    }
    if (isAsyncIterable_1$1.isAsyncIterable(input)) {
      return fromAsyncIterable(input);
    }
    if (isIterable_1$1.isIterable(input)) {
      return fromIterable(input);
    }
    if (isReadableStreamLike_1$2.isReadableStreamLike(input)) {
      return fromReadableStreamLike(input);
    }
  }
  throw throwUnobservableError_1$1.createInvalidObservableTypeError(input);
}
innerFrom$1.innerFrom = innerFrom;
function fromInteropObservable(obj) {
  return new Observable_1$k.Observable(function(subscriber) {
    var obs = obj[observable_1.observable]();
    if (isFunction_1$f.isFunction(obs.subscribe)) {
      return obs.subscribe(subscriber);
    }
    throw new TypeError("Provided object does not correctly implement Symbol.observable");
  });
}
innerFrom$1.fromInteropObservable = fromInteropObservable;
function fromArrayLike(array) {
  return new Observable_1$k.Observable(function(subscriber) {
    for (var i = 0; i < array.length && !subscriber.closed; i++) {
      subscriber.next(array[i]);
    }
    subscriber.complete();
  });
}
innerFrom$1.fromArrayLike = fromArrayLike;
function fromPromise(promise) {
  return new Observable_1$k.Observable(function(subscriber) {
    promise.then(function(value) {
      if (!subscriber.closed) {
        subscriber.next(value);
        subscriber.complete();
      }
    }, function(err) {
      return subscriber.error(err);
    }).then(null, reportUnhandledError_1.reportUnhandledError);
  });
}
innerFrom$1.fromPromise = fromPromise;
function fromIterable(iterable) {
  return new Observable_1$k.Observable(function(subscriber) {
    var e_1, _a;
    try {
      for (var iterable_1 = __values$6(iterable), iterable_1_1 = iterable_1.next(); !iterable_1_1.done; iterable_1_1 = iterable_1.next()) {
        var value = iterable_1_1.value;
        subscriber.next(value);
        if (subscriber.closed) {
          return;
        }
      }
    } catch (e_1_1) {
      e_1 = { error: e_1_1 };
    } finally {
      try {
        if (iterable_1_1 && !iterable_1_1.done && (_a = iterable_1.return)) _a.call(iterable_1);
      } finally {
        if (e_1) throw e_1.error;
      }
    }
    subscriber.complete();
  });
}
innerFrom$1.fromIterable = fromIterable;
function fromAsyncIterable(asyncIterable) {
  return new Observable_1$k.Observable(function(subscriber) {
    process(asyncIterable, subscriber).catch(function(err) {
      return subscriber.error(err);
    });
  });
}
innerFrom$1.fromAsyncIterable = fromAsyncIterable;
function fromReadableStreamLike(readableStream) {
  return fromAsyncIterable(isReadableStreamLike_1$2.readableStreamLikeToAsyncGenerator(readableStream));
}
innerFrom$1.fromReadableStreamLike = fromReadableStreamLike;
function process(asyncIterable, subscriber) {
  var asyncIterable_1, asyncIterable_1_1;
  var e_2, _a;
  return __awaiter(this, void 0, void 0, function() {
    var value, e_2_1;
    return __generator$1(this, function(_b) {
      switch (_b.label) {
        case 0:
          _b.trys.push([0, 5, 6, 11]);
          asyncIterable_1 = __asyncValues(asyncIterable);
          _b.label = 1;
        case 1:
          return [4, asyncIterable_1.next()];
        case 2:
          if (!(asyncIterable_1_1 = _b.sent(), !asyncIterable_1_1.done)) return [3, 4];
          value = asyncIterable_1_1.value;
          subscriber.next(value);
          if (subscriber.closed) {
            return [2];
          }
          _b.label = 3;
        case 3:
          return [3, 1];
        case 4:
          return [3, 11];
        case 5:
          e_2_1 = _b.sent();
          e_2 = { error: e_2_1 };
          return [3, 11];
        case 6:
          _b.trys.push([6, , 9, 10]);
          if (!(asyncIterable_1_1 && !asyncIterable_1_1.done && (_a = asyncIterable_1.return))) return [3, 8];
          return [4, _a.call(asyncIterable_1)];
        case 7:
          _b.sent();
          _b.label = 8;
        case 8:
          return [3, 10];
        case 9:
          if (e_2) throw e_2.error;
          return [7];
        case 10:
          return [7];
        case 11:
          subscriber.complete();
          return [2];
      }
    });
  });
}
var observeOn$1 = {};
var executeSchedule$1 = {};
Object.defineProperty(executeSchedule$1, "__esModule", { value: true });
executeSchedule$1.executeSchedule = void 0;
function executeSchedule(parentSubscription, scheduler, work, delay2, repeat2) {
  if (delay2 === void 0) {
    delay2 = 0;
  }
  if (repeat2 === void 0) {
    repeat2 = false;
  }
  var scheduleSubscription = scheduler.schedule(function() {
    work();
    if (repeat2) {
      parentSubscription.add(this.schedule(null, delay2));
    } else {
      this.unsubscribe();
    }
  }, delay2);
  parentSubscription.add(scheduleSubscription);
  if (!repeat2) {
    return scheduleSubscription;
  }
}
executeSchedule$1.executeSchedule = executeSchedule;
Object.defineProperty(observeOn$1, "__esModule", { value: true });
observeOn$1.observeOn = void 0;
var executeSchedule_1$6 = executeSchedule$1;
var lift_1$12 = lift;
var OperatorSubscriber_1$T = OperatorSubscriber$1;
function observeOn(scheduler, delay2) {
  if (delay2 === void 0) {
    delay2 = 0;
  }
  return lift_1$12.operate(function(source, subscriber) {
    source.subscribe(OperatorSubscriber_1$T.createOperatorSubscriber(subscriber, function(value) {
      return executeSchedule_1$6.executeSchedule(subscriber, scheduler, function() {
        return subscriber.next(value);
      }, delay2);
    }, function() {
      return executeSchedule_1$6.executeSchedule(subscriber, scheduler, function() {
        return subscriber.complete();
      }, delay2);
    }, function(err) {
      return executeSchedule_1$6.executeSchedule(subscriber, scheduler, function() {
        return subscriber.error(err);
      }, delay2);
    }));
  });
}
observeOn$1.observeOn = observeOn;
var subscribeOn$1 = {};
Object.defineProperty(subscribeOn$1, "__esModule", { value: true });
subscribeOn$1.subscribeOn = void 0;
var lift_1$11 = lift;
function subscribeOn(scheduler, delay2) {
  if (delay2 === void 0) {
    delay2 = 0;
  }
  return lift_1$11.operate(function(source, subscriber) {
    subscriber.add(scheduler.schedule(function() {
      return source.subscribe(subscriber);
    }, delay2));
  });
}
subscribeOn$1.subscribeOn = subscribeOn;
Object.defineProperty(scheduleObservable$1, "__esModule", { value: true });
scheduleObservable$1.scheduleObservable = void 0;
var innerFrom_1$D = innerFrom$1;
var observeOn_1$2 = observeOn$1;
var subscribeOn_1$2 = subscribeOn$1;
function scheduleObservable(input, scheduler) {
  return innerFrom_1$D.innerFrom(input).pipe(subscribeOn_1$2.subscribeOn(scheduler), observeOn_1$2.observeOn(scheduler));
}
scheduleObservable$1.scheduleObservable = scheduleObservable;
var schedulePromise$1 = {};
Object.defineProperty(schedulePromise$1, "__esModule", { value: true });
schedulePromise$1.schedulePromise = void 0;
var innerFrom_1$C = innerFrom$1;
var observeOn_1$1 = observeOn$1;
var subscribeOn_1$1 = subscribeOn$1;
function schedulePromise(input, scheduler) {
  return innerFrom_1$C.innerFrom(input).pipe(subscribeOn_1$1.subscribeOn(scheduler), observeOn_1$1.observeOn(scheduler));
}
schedulePromise$1.schedulePromise = schedulePromise;
var scheduleArray$1 = {};
Object.defineProperty(scheduleArray$1, "__esModule", { value: true });
scheduleArray$1.scheduleArray = void 0;
var Observable_1$j = Observable$1;
function scheduleArray(input, scheduler) {
  return new Observable_1$j.Observable(function(subscriber) {
    var i = 0;
    return scheduler.schedule(function() {
      if (i === input.length) {
        subscriber.complete();
      } else {
        subscriber.next(input[i++]);
        if (!subscriber.closed) {
          this.schedule();
        }
      }
    });
  });
}
scheduleArray$1.scheduleArray = scheduleArray;
var scheduleIterable$1 = {};
Object.defineProperty(scheduleIterable$1, "__esModule", { value: true });
scheduleIterable$1.scheduleIterable = void 0;
var Observable_1$i = Observable$1;
var iterator_1 = iterator;
var isFunction_1$e = isFunction$1;
var executeSchedule_1$5 = executeSchedule$1;
function scheduleIterable(input, scheduler) {
  return new Observable_1$i.Observable(function(subscriber) {
    var iterator2;
    executeSchedule_1$5.executeSchedule(subscriber, scheduler, function() {
      iterator2 = input[iterator_1.iterator]();
      executeSchedule_1$5.executeSchedule(subscriber, scheduler, function() {
        var _a;
        var value;
        var done;
        try {
          _a = iterator2.next(), value = _a.value, done = _a.done;
        } catch (err) {
          subscriber.error(err);
          return;
        }
        if (done) {
          subscriber.complete();
        } else {
          subscriber.next(value);
        }
      }, 0, true);
    });
    return function() {
      return isFunction_1$e.isFunction(iterator2 === null || iterator2 === void 0 ? void 0 : iterator2.return) && iterator2.return();
    };
  });
}
scheduleIterable$1.scheduleIterable = scheduleIterable;
var scheduleAsyncIterable$1 = {};
Object.defineProperty(scheduleAsyncIterable$1, "__esModule", { value: true });
scheduleAsyncIterable$1.scheduleAsyncIterable = void 0;
var Observable_1$h = Observable$1;
var executeSchedule_1$4 = executeSchedule$1;
function scheduleAsyncIterable(input, scheduler) {
  if (!input) {
    throw new Error("Iterable cannot be null");
  }
  return new Observable_1$h.Observable(function(subscriber) {
    executeSchedule_1$4.executeSchedule(subscriber, scheduler, function() {
      var iterator2 = input[Symbol.asyncIterator]();
      executeSchedule_1$4.executeSchedule(subscriber, scheduler, function() {
        iterator2.next().then(function(result) {
          if (result.done) {
            subscriber.complete();
          } else {
            subscriber.next(result.value);
          }
        });
      }, 0, true);
    });
  });
}
scheduleAsyncIterable$1.scheduleAsyncIterable = scheduleAsyncIterable;
var scheduleReadableStreamLike$1 = {};
Object.defineProperty(scheduleReadableStreamLike$1, "__esModule", { value: true });
scheduleReadableStreamLike$1.scheduleReadableStreamLike = void 0;
var scheduleAsyncIterable_1$1 = scheduleAsyncIterable$1;
var isReadableStreamLike_1$1 = isReadableStreamLike$1;
function scheduleReadableStreamLike(input, scheduler) {
  return scheduleAsyncIterable_1$1.scheduleAsyncIterable(isReadableStreamLike_1$1.readableStreamLikeToAsyncGenerator(input), scheduler);
}
scheduleReadableStreamLike$1.scheduleReadableStreamLike = scheduleReadableStreamLike;
Object.defineProperty(scheduled$1, "__esModule", { value: true });
scheduled$1.scheduled = void 0;
var scheduleObservable_1 = scheduleObservable$1;
var schedulePromise_1 = schedulePromise$1;
var scheduleArray_1 = scheduleArray$1;
var scheduleIterable_1$1 = scheduleIterable$1;
var scheduleAsyncIterable_1 = scheduleAsyncIterable$1;
var isInteropObservable_1 = isInteropObservable$1;
var isPromise_1 = isPromise$1;
var isArrayLike_1$1 = isArrayLike;
var isIterable_1 = isIterable$1;
var isAsyncIterable_1 = isAsyncIterable$1;
var throwUnobservableError_1 = throwUnobservableError;
var isReadableStreamLike_1 = isReadableStreamLike$1;
var scheduleReadableStreamLike_1 = scheduleReadableStreamLike$1;
function scheduled(input, scheduler) {
  if (input != null) {
    if (isInteropObservable_1.isInteropObservable(input)) {
      return scheduleObservable_1.scheduleObservable(input, scheduler);
    }
    if (isArrayLike_1$1.isArrayLike(input)) {
      return scheduleArray_1.scheduleArray(input, scheduler);
    }
    if (isPromise_1.isPromise(input)) {
      return schedulePromise_1.schedulePromise(input, scheduler);
    }
    if (isAsyncIterable_1.isAsyncIterable(input)) {
      return scheduleAsyncIterable_1.scheduleAsyncIterable(input, scheduler);
    }
    if (isIterable_1.isIterable(input)) {
      return scheduleIterable_1$1.scheduleIterable(input, scheduler);
    }
    if (isReadableStreamLike_1.isReadableStreamLike(input)) {
      return scheduleReadableStreamLike_1.scheduleReadableStreamLike(input, scheduler);
    }
  }
  throw throwUnobservableError_1.createInvalidObservableTypeError(input);
}
scheduled$1.scheduled = scheduled;
Object.defineProperty(from$1, "__esModule", { value: true });
from$1.from = void 0;
var scheduled_1 = scheduled$1;
var innerFrom_1$B = innerFrom$1;
function from(input, scheduler) {
  return scheduler ? scheduled_1.scheduled(input, scheduler) : innerFrom_1$B.innerFrom(input);
}
from$1.from = from;
Object.defineProperty(of$1, "__esModule", { value: true });
of$1.of = void 0;
var args_1$c = args;
var from_1$6 = from$1;
function of() {
  var args2 = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args2[_i] = arguments[_i];
  }
  var scheduler = args_1$c.popScheduler(args2);
  return from_1$6.from(args2, scheduler);
}
of$1.of = of;
var throwError$1 = {};
Object.defineProperty(throwError$1, "__esModule", { value: true });
throwError$1.throwError = void 0;
var Observable_1$g = Observable$1;
var isFunction_1$d = isFunction$1;
function throwError(errorOrErrorFactory, scheduler) {
  var errorFactory = isFunction_1$d.isFunction(errorOrErrorFactory) ? errorOrErrorFactory : function() {
    return errorOrErrorFactory;
  };
  var init = function(subscriber) {
    return subscriber.error(errorFactory());
  };
  return new Observable_1$g.Observable(scheduler ? function(subscriber) {
    return scheduler.schedule(init, 0, subscriber);
  } : init);
}
throwError$1.throwError = throwError;
(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.observeNotification = exports.Notification = exports.NotificationKind = void 0;
  var empty_12 = empty;
  var of_12 = of$1;
  var throwError_1 = throwError$1;
  var isFunction_12 = isFunction$1;
  (function(NotificationKind) {
    NotificationKind["NEXT"] = "N";
    NotificationKind["ERROR"] = "E";
    NotificationKind["COMPLETE"] = "C";
  })(exports.NotificationKind || (exports.NotificationKind = {}));
  var Notification2 = function() {
    function Notification3(kind, value, error) {
      this.kind = kind;
      this.value = value;
      this.error = error;
      this.hasValue = kind === "N";
    }
    Notification3.prototype.observe = function(observer) {
      return observeNotification(this, observer);
    };
    Notification3.prototype.do = function(nextHandler, errorHandler, completeHandler) {
      var _a = this, kind = _a.kind, value = _a.value, error = _a.error;
      return kind === "N" ? nextHandler === null || nextHandler === void 0 ? void 0 : nextHandler(value) : kind === "E" ? errorHandler === null || errorHandler === void 0 ? void 0 : errorHandler(error) : completeHandler === null || completeHandler === void 0 ? void 0 : completeHandler();
    };
    Notification3.prototype.accept = function(nextOrObserver, error, complete) {
      var _a;
      return isFunction_12.isFunction((_a = nextOrObserver) === null || _a === void 0 ? void 0 : _a.next) ? this.observe(nextOrObserver) : this.do(nextOrObserver, error, complete);
    };
    Notification3.prototype.toObservable = function() {
      var _a = this, kind = _a.kind, value = _a.value, error = _a.error;
      var result = kind === "N" ? of_12.of(value) : kind === "E" ? throwError_1.throwError(function() {
        return error;
      }) : kind === "C" ? empty_12.EMPTY : 0;
      if (!result) {
        throw new TypeError("Unexpected notification kind " + kind);
      }
      return result;
    };
    Notification3.createNext = function(value) {
      return new Notification3("N", value);
    };
    Notification3.createError = function(err) {
      return new Notification3("E", void 0, err);
    };
    Notification3.createComplete = function() {
      return Notification3.completeNotification;
    };
    Notification3.completeNotification = new Notification3("C");
    return Notification3;
  }();
  exports.Notification = Notification2;
  function observeNotification(notification, observer) {
    var _a, _b, _c;
    var _d = notification, kind = _d.kind, value = _d.value, error = _d.error;
    if (typeof kind !== "string") {
      throw new TypeError('Invalid notification, missing "kind"');
    }
    kind === "N" ? (_a = observer.next) === null || _a === void 0 ? void 0 : _a.call(observer, value) : kind === "E" ? (_b = observer.error) === null || _b === void 0 ? void 0 : _b.call(observer, error) : (_c = observer.complete) === null || _c === void 0 ? void 0 : _c.call(observer);
  }
  exports.observeNotification = observeNotification;
})(Notification);
var isObservable$1 = {};
Object.defineProperty(isObservable$1, "__esModule", { value: true });
isObservable$1.isObservable = void 0;
var Observable_1$f = Observable$1;
var isFunction_1$c = isFunction$1;
function isObservable(obj) {
  return !!obj && (obj instanceof Observable_1$f.Observable || isFunction_1$c.isFunction(obj.lift) && isFunction_1$c.isFunction(obj.subscribe));
}
isObservable$1.isObservable = isObservable;
var lastValueFrom$1 = {};
var EmptyError = {};
Object.defineProperty(EmptyError, "__esModule", { value: true });
EmptyError.EmptyError = void 0;
var createErrorClass_1$3 = createErrorClass$1;
EmptyError.EmptyError = createErrorClass_1$3.createErrorClass(function(_super) {
  return function EmptyErrorImpl() {
    _super(this);
    this.name = "EmptyError";
    this.message = "no elements in sequence";
  };
});
Object.defineProperty(lastValueFrom$1, "__esModule", { value: true });
lastValueFrom$1.lastValueFrom = void 0;
var EmptyError_1$5 = EmptyError;
function lastValueFrom(source, config2) {
  var hasConfig = typeof config2 === "object";
  return new Promise(function(resolve, reject) {
    var _hasValue = false;
    var _value;
    source.subscribe({
      next: function(value) {
        _value = value;
        _hasValue = true;
      },
      error: reject,
      complete: function() {
        if (_hasValue) {
          resolve(_value);
        } else if (hasConfig) {
          resolve(config2.defaultValue);
        } else {
          reject(new EmptyError_1$5.EmptyError());
        }
      }
    });
  });
}
lastValueFrom$1.lastValueFrom = lastValueFrom;
var firstValueFrom$1 = {};
Object.defineProperty(firstValueFrom$1, "__esModule", { value: true });
firstValueFrom$1.firstValueFrom = void 0;
var EmptyError_1$4 = EmptyError;
var Subscriber_1$1 = Subscriber;
function firstValueFrom(source, config2) {
  var hasConfig = typeof config2 === "object";
  return new Promise(function(resolve, reject) {
    var subscriber = new Subscriber_1$1.SafeSubscriber({
      next: function(value) {
        resolve(value);
        subscriber.unsubscribe();
      },
      error: reject,
      complete: function() {
        if (hasConfig) {
          resolve(config2.defaultValue);
        } else {
          reject(new EmptyError_1$4.EmptyError());
        }
      }
    });
    source.subscribe(subscriber);
  });
}
firstValueFrom$1.firstValueFrom = firstValueFrom;
var ArgumentOutOfRangeError = {};
Object.defineProperty(ArgumentOutOfRangeError, "__esModule", { value: true });
ArgumentOutOfRangeError.ArgumentOutOfRangeError = void 0;
var createErrorClass_1$2 = createErrorClass$1;
ArgumentOutOfRangeError.ArgumentOutOfRangeError = createErrorClass_1$2.createErrorClass(function(_super) {
  return function ArgumentOutOfRangeErrorImpl() {
    _super(this);
    this.name = "ArgumentOutOfRangeError";
    this.message = "argument out of range";
  };
});
var NotFoundError = {};
Object.defineProperty(NotFoundError, "__esModule", { value: true });
NotFoundError.NotFoundError = void 0;
var createErrorClass_1$1 = createErrorClass$1;
NotFoundError.NotFoundError = createErrorClass_1$1.createErrorClass(function(_super) {
  return function NotFoundErrorImpl(message) {
    _super(this);
    this.name = "NotFoundError";
    this.message = message;
  };
});
var SequenceError = {};
Object.defineProperty(SequenceError, "__esModule", { value: true });
SequenceError.SequenceError = void 0;
var createErrorClass_1 = createErrorClass$1;
SequenceError.SequenceError = createErrorClass_1.createErrorClass(function(_super) {
  return function SequenceErrorImpl(message) {
    _super(this);
    this.name = "SequenceError";
    this.message = message;
  };
});
var timeout = {};
var isDate = {};
Object.defineProperty(isDate, "__esModule", { value: true });
isDate.isValidDate = void 0;
function isValidDate(value) {
  return value instanceof Date && !isNaN(value);
}
isDate.isValidDate = isValidDate;
(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.timeout = exports.TimeoutError = void 0;
  var async_12 = async;
  var isDate_12 = isDate;
  var lift_12 = lift;
  var innerFrom_12 = innerFrom$1;
  var createErrorClass_12 = createErrorClass$1;
  var OperatorSubscriber_12 = OperatorSubscriber$1;
  var executeSchedule_12 = executeSchedule$1;
  exports.TimeoutError = createErrorClass_12.createErrorClass(function(_super) {
    return function TimeoutErrorImpl(info) {
      if (info === void 0) {
        info = null;
      }
      _super(this);
      this.message = "Timeout has occurred";
      this.name = "TimeoutError";
      this.info = info;
    };
  });
  function timeout2(config2, schedulerArg) {
    var _a = isDate_12.isValidDate(config2) ? { first: config2 } : typeof config2 === "number" ? { each: config2 } : config2, first2 = _a.first, each = _a.each, _b = _a.with, _with = _b === void 0 ? timeoutErrorFactory : _b, _c = _a.scheduler, scheduler = _c === void 0 ? schedulerArg !== null && schedulerArg !== void 0 ? schedulerArg : async_12.asyncScheduler : _c, _d = _a.meta, meta = _d === void 0 ? null : _d;
    if (first2 == null && each == null) {
      throw new TypeError("No timeout provided.");
    }
    return lift_12.operate(function(source, subscriber) {
      var originalSourceSubscription;
      var timerSubscription;
      var lastValue = null;
      var seen = 0;
      var startTimer = function(delay2) {
        timerSubscription = executeSchedule_12.executeSchedule(subscriber, scheduler, function() {
          try {
            originalSourceSubscription.unsubscribe();
            innerFrom_12.innerFrom(_with({
              meta,
              lastValue,
              seen
            })).subscribe(subscriber);
          } catch (err) {
            subscriber.error(err);
          }
        }, delay2);
      };
      originalSourceSubscription = source.subscribe(OperatorSubscriber_12.createOperatorSubscriber(subscriber, function(value) {
        timerSubscription === null || timerSubscription === void 0 ? void 0 : timerSubscription.unsubscribe();
        seen++;
        subscriber.next(lastValue = value);
        each > 0 && startTimer(each);
      }, void 0, void 0, function() {
        if (!(timerSubscription === null || timerSubscription === void 0 ? void 0 : timerSubscription.closed)) {
          timerSubscription === null || timerSubscription === void 0 ? void 0 : timerSubscription.unsubscribe();
        }
        lastValue = null;
      }));
      !seen && startTimer(first2 != null ? typeof first2 === "number" ? first2 : +first2 - scheduler.now() : each);
    });
  }
  exports.timeout = timeout2;
  function timeoutErrorFactory(info) {
    throw new exports.TimeoutError(info);
  }
})(timeout);
var bindCallback$1 = {};
var bindCallbackInternals$1 = {};
var mapOneOrManyArgs$1 = {};
var map$1 = {};
Object.defineProperty(map$1, "__esModule", { value: true });
map$1.map = void 0;
var lift_1$10 = lift;
var OperatorSubscriber_1$S = OperatorSubscriber$1;
function map(project, thisArg) {
  return lift_1$10.operate(function(source, subscriber) {
    var index = 0;
    source.subscribe(OperatorSubscriber_1$S.createOperatorSubscriber(subscriber, function(value) {
      subscriber.next(project.call(thisArg, value, index++));
    }));
  });
}
map$1.map = map;
var __read$g = commonjsGlobal && commonjsGlobal.__read || function(o, n2) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
    while ((n2 === void 0 || n2-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar;
};
var __spreadArray$f = commonjsGlobal && commonjsGlobal.__spreadArray || function(to, from2) {
  for (var i = 0, il = from2.length, j2 = to.length; i < il; i++, j2++)
    to[j2] = from2[i];
  return to;
};
Object.defineProperty(mapOneOrManyArgs$1, "__esModule", { value: true });
mapOneOrManyArgs$1.mapOneOrManyArgs = void 0;
var map_1$5 = map$1;
var isArray$2 = Array.isArray;
function callOrApply(fn, args2) {
  return isArray$2(args2) ? fn.apply(void 0, __spreadArray$f([], __read$g(args2))) : fn(args2);
}
function mapOneOrManyArgs(fn) {
  return map_1$5.map(function(args2) {
    return callOrApply(fn, args2);
  });
}
mapOneOrManyArgs$1.mapOneOrManyArgs = mapOneOrManyArgs;
var __read$f = commonjsGlobal && commonjsGlobal.__read || function(o, n2) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
    while ((n2 === void 0 || n2-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar;
};
var __spreadArray$e = commonjsGlobal && commonjsGlobal.__spreadArray || function(to, from2) {
  for (var i = 0, il = from2.length, j2 = to.length; i < il; i++, j2++)
    to[j2] = from2[i];
  return to;
};
Object.defineProperty(bindCallbackInternals$1, "__esModule", { value: true });
bindCallbackInternals$1.bindCallbackInternals = void 0;
var isScheduler_1$2 = isScheduler$1;
var Observable_1$e = Observable$1;
var subscribeOn_1 = subscribeOn$1;
var mapOneOrManyArgs_1$6 = mapOneOrManyArgs$1;
var observeOn_1 = observeOn$1;
var AsyncSubject_1$1 = AsyncSubject$1;
function bindCallbackInternals(isNodeStyle, callbackFunc, resultSelector, scheduler) {
  if (resultSelector) {
    if (isScheduler_1$2.isScheduler(resultSelector)) {
      scheduler = resultSelector;
    } else {
      return function() {
        var args2 = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args2[_i] = arguments[_i];
        }
        return bindCallbackInternals(isNodeStyle, callbackFunc, scheduler).apply(this, args2).pipe(mapOneOrManyArgs_1$6.mapOneOrManyArgs(resultSelector));
      };
    }
  }
  if (scheduler) {
    return function() {
      var args2 = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args2[_i] = arguments[_i];
      }
      return bindCallbackInternals(isNodeStyle, callbackFunc).apply(this, args2).pipe(subscribeOn_1.subscribeOn(scheduler), observeOn_1.observeOn(scheduler));
    };
  }
  return function() {
    var _this = this;
    var args2 = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args2[_i] = arguments[_i];
    }
    var subject = new AsyncSubject_1$1.AsyncSubject();
    var uninitialized = true;
    return new Observable_1$e.Observable(function(subscriber) {
      var subs = subject.subscribe(subscriber);
      if (uninitialized) {
        uninitialized = false;
        var isAsync_1 = false;
        var isComplete_1 = false;
        callbackFunc.apply(_this, __spreadArray$e(__spreadArray$e([], __read$f(args2)), [
          function() {
            var results = [];
            for (var _i2 = 0; _i2 < arguments.length; _i2++) {
              results[_i2] = arguments[_i2];
            }
            if (isNodeStyle) {
              var err = results.shift();
              if (err != null) {
                subject.error(err);
                return;
              }
            }
            subject.next(1 < results.length ? results : results[0]);
            isComplete_1 = true;
            if (isAsync_1) {
              subject.complete();
            }
          }
        ]));
        if (isComplete_1) {
          subject.complete();
        }
        isAsync_1 = true;
      }
      return subs;
    });
  };
}
bindCallbackInternals$1.bindCallbackInternals = bindCallbackInternals;
Object.defineProperty(bindCallback$1, "__esModule", { value: true });
bindCallback$1.bindCallback = void 0;
var bindCallbackInternals_1$1 = bindCallbackInternals$1;
function bindCallback(callbackFunc, resultSelector, scheduler) {
  return bindCallbackInternals_1$1.bindCallbackInternals(false, callbackFunc, resultSelector, scheduler);
}
bindCallback$1.bindCallback = bindCallback;
var bindNodeCallback$1 = {};
Object.defineProperty(bindNodeCallback$1, "__esModule", { value: true });
bindNodeCallback$1.bindNodeCallback = void 0;
var bindCallbackInternals_1 = bindCallbackInternals$1;
function bindNodeCallback(callbackFunc, resultSelector, scheduler) {
  return bindCallbackInternals_1.bindCallbackInternals(true, callbackFunc, resultSelector, scheduler);
}
bindNodeCallback$1.bindNodeCallback = bindNodeCallback;
var combineLatest$3 = {};
var argsArgArrayOrObject$1 = {};
Object.defineProperty(argsArgArrayOrObject$1, "__esModule", { value: true });
argsArgArrayOrObject$1.argsArgArrayOrObject = void 0;
var isArray$1 = Array.isArray;
var getPrototypeOf = Object.getPrototypeOf, objectProto = Object.prototype, getKeys = Object.keys;
function argsArgArrayOrObject(args2) {
  if (args2.length === 1) {
    var first_1 = args2[0];
    if (isArray$1(first_1)) {
      return { args: first_1, keys: null };
    }
    if (isPOJO(first_1)) {
      var keys = getKeys(first_1);
      return {
        args: keys.map(function(key) {
          return first_1[key];
        }),
        keys
      };
    }
  }
  return { args: args2, keys: null };
}
argsArgArrayOrObject$1.argsArgArrayOrObject = argsArgArrayOrObject;
function isPOJO(obj) {
  return obj && typeof obj === "object" && getPrototypeOf(obj) === objectProto;
}
var createObject$1 = {};
Object.defineProperty(createObject$1, "__esModule", { value: true });
createObject$1.createObject = void 0;
function createObject(keys, values) {
  return keys.reduce(function(result, key, i) {
    return result[key] = values[i], result;
  }, {});
}
createObject$1.createObject = createObject;
Object.defineProperty(combineLatest$3, "__esModule", { value: true });
combineLatest$3.combineLatestInit = combineLatest$3.combineLatest = void 0;
var Observable_1$d = Observable$1;
var argsArgArrayOrObject_1$1 = argsArgArrayOrObject$1;
var from_1$5 = from$1;
var identity_1$d = identity$1;
var mapOneOrManyArgs_1$5 = mapOneOrManyArgs$1;
var args_1$b = args;
var createObject_1$1 = createObject$1;
var OperatorSubscriber_1$R = OperatorSubscriber$1;
var executeSchedule_1$3 = executeSchedule$1;
function combineLatest$2() {
  var args2 = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args2[_i] = arguments[_i];
  }
  var scheduler = args_1$b.popScheduler(args2);
  var resultSelector = args_1$b.popResultSelector(args2);
  var _a = argsArgArrayOrObject_1$1.argsArgArrayOrObject(args2), observables = _a.args, keys = _a.keys;
  if (observables.length === 0) {
    return from_1$5.from([], scheduler);
  }
  var result = new Observable_1$d.Observable(combineLatestInit(observables, scheduler, keys ? function(values) {
    return createObject_1$1.createObject(keys, values);
  } : identity_1$d.identity));
  return resultSelector ? result.pipe(mapOneOrManyArgs_1$5.mapOneOrManyArgs(resultSelector)) : result;
}
combineLatest$3.combineLatest = combineLatest$2;
function combineLatestInit(observables, scheduler, valueTransform) {
  if (valueTransform === void 0) {
    valueTransform = identity_1$d.identity;
  }
  return function(subscriber) {
    maybeSchedule(scheduler, function() {
      var length = observables.length;
      var values = new Array(length);
      var active = length;
      var remainingFirstValues = length;
      var _loop_1 = function(i2) {
        maybeSchedule(scheduler, function() {
          var source = from_1$5.from(observables[i2], scheduler);
          var hasFirstValue = false;
          source.subscribe(OperatorSubscriber_1$R.createOperatorSubscriber(subscriber, function(value) {
            values[i2] = value;
            if (!hasFirstValue) {
              hasFirstValue = true;
              remainingFirstValues--;
            }
            if (!remainingFirstValues) {
              subscriber.next(valueTransform(values.slice()));
            }
          }, function() {
            if (!--active) {
              subscriber.complete();
            }
          }));
        }, subscriber);
      };
      for (var i = 0; i < length; i++) {
        _loop_1(i);
      }
    }, subscriber);
  };
}
combineLatest$3.combineLatestInit = combineLatestInit;
function maybeSchedule(scheduler, execute, subscription) {
  if (scheduler) {
    executeSchedule_1$3.executeSchedule(subscription, scheduler, execute);
  } else {
    execute();
  }
}
var concat$3 = {};
var concatAll$1 = {};
var mergeAll$1 = {};
var mergeMap$1 = {};
var mergeInternals$1 = {};
Object.defineProperty(mergeInternals$1, "__esModule", { value: true });
mergeInternals$1.mergeInternals = void 0;
var innerFrom_1$A = innerFrom$1;
var executeSchedule_1$2 = executeSchedule$1;
var OperatorSubscriber_1$Q = OperatorSubscriber$1;
function mergeInternals(source, subscriber, project, concurrent, onBeforeNext, expand2, innerSubScheduler, additionalFinalizer) {
  var buffer2 = [];
  var active = 0;
  var index = 0;
  var isComplete = false;
  var checkComplete = function() {
    if (isComplete && !buffer2.length && !active) {
      subscriber.complete();
    }
  };
  var outerNext = function(value) {
    return active < concurrent ? doInnerSub(value) : buffer2.push(value);
  };
  var doInnerSub = function(value) {
    expand2 && subscriber.next(value);
    active++;
    var innerComplete = false;
    innerFrom_1$A.innerFrom(project(value, index++)).subscribe(OperatorSubscriber_1$Q.createOperatorSubscriber(subscriber, function(innerValue) {
      onBeforeNext === null || onBeforeNext === void 0 ? void 0 : onBeforeNext(innerValue);
      if (expand2) {
        outerNext(innerValue);
      } else {
        subscriber.next(innerValue);
      }
    }, function() {
      innerComplete = true;
    }, void 0, function() {
      if (innerComplete) {
        try {
          active--;
          var _loop_1 = function() {
            var bufferedValue = buffer2.shift();
            if (innerSubScheduler) {
              executeSchedule_1$2.executeSchedule(subscriber, innerSubScheduler, function() {
                return doInnerSub(bufferedValue);
              });
            } else {
              doInnerSub(bufferedValue);
            }
          };
          while (buffer2.length && active < concurrent) {
            _loop_1();
          }
          checkComplete();
        } catch (err) {
          subscriber.error(err);
        }
      }
    }));
  };
  source.subscribe(OperatorSubscriber_1$Q.createOperatorSubscriber(subscriber, outerNext, function() {
    isComplete = true;
    checkComplete();
  }));
  return function() {
    additionalFinalizer === null || additionalFinalizer === void 0 ? void 0 : additionalFinalizer();
  };
}
mergeInternals$1.mergeInternals = mergeInternals;
Object.defineProperty(mergeMap$1, "__esModule", { value: true });
mergeMap$1.mergeMap = void 0;
var map_1$4 = map$1;
var innerFrom_1$z = innerFrom$1;
var lift_1$$ = lift;
var mergeInternals_1$2 = mergeInternals$1;
var isFunction_1$b = isFunction$1;
function mergeMap(project, resultSelector, concurrent) {
  if (concurrent === void 0) {
    concurrent = Infinity;
  }
  if (isFunction_1$b.isFunction(resultSelector)) {
    return mergeMap(function(a, i) {
      return map_1$4.map(function(b, ii) {
        return resultSelector(a, b, i, ii);
      })(innerFrom_1$z.innerFrom(project(a, i)));
    }, concurrent);
  } else if (typeof resultSelector === "number") {
    concurrent = resultSelector;
  }
  return lift_1$$.operate(function(source, subscriber) {
    return mergeInternals_1$2.mergeInternals(source, subscriber, project, concurrent);
  });
}
mergeMap$1.mergeMap = mergeMap;
Object.defineProperty(mergeAll$1, "__esModule", { value: true });
mergeAll$1.mergeAll = void 0;
var mergeMap_1$6 = mergeMap$1;
var identity_1$c = identity$1;
function mergeAll(concurrent) {
  if (concurrent === void 0) {
    concurrent = Infinity;
  }
  return mergeMap_1$6.mergeMap(identity_1$c.identity, concurrent);
}
mergeAll$1.mergeAll = mergeAll;
Object.defineProperty(concatAll$1, "__esModule", { value: true });
concatAll$1.concatAll = void 0;
var mergeAll_1$2 = mergeAll$1;
function concatAll() {
  return mergeAll_1$2.mergeAll(1);
}
concatAll$1.concatAll = concatAll;
Object.defineProperty(concat$3, "__esModule", { value: true });
concat$3.concat = void 0;
var concatAll_1$1 = concatAll$1;
var args_1$a = args;
var from_1$4 = from$1;
function concat$2() {
  var args2 = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args2[_i] = arguments[_i];
  }
  return concatAll_1$1.concatAll()(from_1$4.from(args2, args_1$a.popScheduler(args2)));
}
concat$3.concat = concat$2;
var connectable$1 = {};
var defer$1 = {};
Object.defineProperty(defer$1, "__esModule", { value: true });
defer$1.defer = void 0;
var Observable_1$c = Observable$1;
var innerFrom_1$y = innerFrom$1;
function defer(observableFactory) {
  return new Observable_1$c.Observable(function(subscriber) {
    innerFrom_1$y.innerFrom(observableFactory()).subscribe(subscriber);
  });
}
defer$1.defer = defer;
Object.defineProperty(connectable$1, "__esModule", { value: true });
connectable$1.connectable = void 0;
var Subject_1$b = Subject$1;
var Observable_1$b = Observable$1;
var defer_1$2 = defer$1;
var DEFAULT_CONFIG$1 = {
  connector: function() {
    return new Subject_1$b.Subject();
  },
  resetOnDisconnect: true
};
function connectable(source, config2) {
  if (config2 === void 0) {
    config2 = DEFAULT_CONFIG$1;
  }
  var connection = null;
  var connector = config2.connector, _a = config2.resetOnDisconnect, resetOnDisconnect = _a === void 0 ? true : _a;
  var subject = connector();
  var result = new Observable_1$b.Observable(function(subscriber) {
    return subject.subscribe(subscriber);
  });
  result.connect = function() {
    if (!connection || connection.closed) {
      connection = defer_1$2.defer(function() {
        return source;
      }).subscribe(subject);
      if (resetOnDisconnect) {
        connection.add(function() {
          return subject = connector();
        });
      }
    }
    return connection;
  };
  return result;
}
connectable$1.connectable = connectable;
var forkJoin$1 = {};
Object.defineProperty(forkJoin$1, "__esModule", { value: true });
forkJoin$1.forkJoin = void 0;
var Observable_1$a = Observable$1;
var argsArgArrayOrObject_1 = argsArgArrayOrObject$1;
var innerFrom_1$x = innerFrom$1;
var args_1$9 = args;
var OperatorSubscriber_1$P = OperatorSubscriber$1;
var mapOneOrManyArgs_1$4 = mapOneOrManyArgs$1;
var createObject_1 = createObject$1;
function forkJoin() {
  var args2 = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args2[_i] = arguments[_i];
  }
  var resultSelector = args_1$9.popResultSelector(args2);
  var _a = argsArgArrayOrObject_1.argsArgArrayOrObject(args2), sources = _a.args, keys = _a.keys;
  var result = new Observable_1$a.Observable(function(subscriber) {
    var length = sources.length;
    if (!length) {
      subscriber.complete();
      return;
    }
    var values = new Array(length);
    var remainingCompletions = length;
    var remainingEmissions = length;
    var _loop_1 = function(sourceIndex2) {
      var hasValue = false;
      innerFrom_1$x.innerFrom(sources[sourceIndex2]).subscribe(OperatorSubscriber_1$P.createOperatorSubscriber(subscriber, function(value) {
        if (!hasValue) {
          hasValue = true;
          remainingEmissions--;
        }
        values[sourceIndex2] = value;
      }, function() {
        return remainingCompletions--;
      }, void 0, function() {
        if (!remainingCompletions || !hasValue) {
          if (!remainingEmissions) {
            subscriber.next(keys ? createObject_1.createObject(keys, values) : values);
          }
          subscriber.complete();
        }
      }));
    };
    for (var sourceIndex = 0; sourceIndex < length; sourceIndex++) {
      _loop_1(sourceIndex);
    }
  });
  return resultSelector ? result.pipe(mapOneOrManyArgs_1$4.mapOneOrManyArgs(resultSelector)) : result;
}
forkJoin$1.forkJoin = forkJoin;
var fromEvent$1 = {};
var __read$e = commonjsGlobal && commonjsGlobal.__read || function(o, n2) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
    while ((n2 === void 0 || n2-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar;
};
Object.defineProperty(fromEvent$1, "__esModule", { value: true });
fromEvent$1.fromEvent = void 0;
var innerFrom_1$w = innerFrom$1;
var Observable_1$9 = Observable$1;
var mergeMap_1$5 = mergeMap$1;
var isArrayLike_1 = isArrayLike;
var isFunction_1$a = isFunction$1;
var mapOneOrManyArgs_1$3 = mapOneOrManyArgs$1;
var nodeEventEmitterMethods = ["addListener", "removeListener"];
var eventTargetMethods = ["addEventListener", "removeEventListener"];
var jqueryMethods = ["on", "off"];
function fromEvent(target, eventName, options, resultSelector) {
  if (isFunction_1$a.isFunction(options)) {
    resultSelector = options;
    options = void 0;
  }
  if (resultSelector) {
    return fromEvent(target, eventName, options).pipe(mapOneOrManyArgs_1$3.mapOneOrManyArgs(resultSelector));
  }
  var _a = __read$e(isEventTarget(target) ? eventTargetMethods.map(function(methodName) {
    return function(handler) {
      return target[methodName](eventName, handler, options);
    };
  }) : isNodeStyleEventEmitter(target) ? nodeEventEmitterMethods.map(toCommonHandlerRegistry(target, eventName)) : isJQueryStyleEventEmitter(target) ? jqueryMethods.map(toCommonHandlerRegistry(target, eventName)) : [], 2), add = _a[0], remove = _a[1];
  if (!add) {
    if (isArrayLike_1.isArrayLike(target)) {
      return mergeMap_1$5.mergeMap(function(subTarget) {
        return fromEvent(subTarget, eventName, options);
      })(innerFrom_1$w.innerFrom(target));
    }
  }
  if (!add) {
    throw new TypeError("Invalid event target");
  }
  return new Observable_1$9.Observable(function(subscriber) {
    var handler = function() {
      var args2 = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args2[_i] = arguments[_i];
      }
      return subscriber.next(1 < args2.length ? args2 : args2[0]);
    };
    add(handler);
    return function() {
      return remove(handler);
    };
  });
}
fromEvent$1.fromEvent = fromEvent;
function toCommonHandlerRegistry(target, eventName) {
  return function(methodName) {
    return function(handler) {
      return target[methodName](eventName, handler);
    };
  };
}
function isNodeStyleEventEmitter(target) {
  return isFunction_1$a.isFunction(target.addListener) && isFunction_1$a.isFunction(target.removeListener);
}
function isJQueryStyleEventEmitter(target) {
  return isFunction_1$a.isFunction(target.on) && isFunction_1$a.isFunction(target.off);
}
function isEventTarget(target) {
  return isFunction_1$a.isFunction(target.addEventListener) && isFunction_1$a.isFunction(target.removeEventListener);
}
var fromEventPattern$1 = {};
Object.defineProperty(fromEventPattern$1, "__esModule", { value: true });
fromEventPattern$1.fromEventPattern = void 0;
var Observable_1$8 = Observable$1;
var isFunction_1$9 = isFunction$1;
var mapOneOrManyArgs_1$2 = mapOneOrManyArgs$1;
function fromEventPattern(addHandler, removeHandler, resultSelector) {
  if (resultSelector) {
    return fromEventPattern(addHandler, removeHandler).pipe(mapOneOrManyArgs_1$2.mapOneOrManyArgs(resultSelector));
  }
  return new Observable_1$8.Observable(function(subscriber) {
    var handler = function() {
      var e = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        e[_i] = arguments[_i];
      }
      return subscriber.next(e.length === 1 ? e[0] : e);
    };
    var retValue = addHandler(handler);
    return isFunction_1$9.isFunction(removeHandler) ? function() {
      return removeHandler(handler, retValue);
    } : void 0;
  });
}
fromEventPattern$1.fromEventPattern = fromEventPattern;
var generate$1 = {};
var __generator = commonjsGlobal && commonjsGlobal.__generator || function(thisArg, body) {
  var _ = { label: 0, sent: function() {
    if (t[0] & 1) throw t[1];
    return t[1];
  }, trys: [], ops: [] }, f, y2, t, g2;
  return g2 = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g2[Symbol.iterator] = function() {
    return this;
  }), g2;
  function verb(n2) {
    return function(v) {
      return step([n2, v]);
    };
  }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (_) try {
      if (f = 1, y2 && (t = op[0] & 2 ? y2["return"] : op[0] ? y2["throw"] || ((t = y2["return"]) && t.call(y2), 0) : y2.next) && !(t = t.call(y2, op[1])).done) return t;
      if (y2 = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;
        case 4:
          _.label++;
          return { value: op[1], done: false };
        case 5:
          _.label++;
          y2 = op[1];
          op = [0];
          continue;
        case 7:
          op = _.ops.pop();
          _.trys.pop();
          continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }
          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }
          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }
          if (t && _.label < t[2]) {
            _.label = t[2];
            _.ops.push(op);
            break;
          }
          if (t[2]) _.ops.pop();
          _.trys.pop();
          continue;
      }
      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y2 = 0;
    } finally {
      f = t = 0;
    }
    if (op[0] & 5) throw op[1];
    return { value: op[0] ? op[1] : void 0, done: true };
  }
};
Object.defineProperty(generate$1, "__esModule", { value: true });
generate$1.generate = void 0;
var identity_1$b = identity$1;
var isScheduler_1$1 = isScheduler$1;
var defer_1$1 = defer$1;
var scheduleIterable_1 = scheduleIterable$1;
function generate(initialStateOrOptions, condition, iterate, resultSelectorOrScheduler, scheduler) {
  var _a, _b;
  var resultSelector;
  var initialState;
  if (arguments.length === 1) {
    _a = initialStateOrOptions, initialState = _a.initialState, condition = _a.condition, iterate = _a.iterate, _b = _a.resultSelector, resultSelector = _b === void 0 ? identity_1$b.identity : _b, scheduler = _a.scheduler;
  } else {
    initialState = initialStateOrOptions;
    if (!resultSelectorOrScheduler || isScheduler_1$1.isScheduler(resultSelectorOrScheduler)) {
      resultSelector = identity_1$b.identity;
      scheduler = resultSelectorOrScheduler;
    } else {
      resultSelector = resultSelectorOrScheduler;
    }
  }
  function gen() {
    var state;
    return __generator(this, function(_a2) {
      switch (_a2.label) {
        case 0:
          state = initialState;
          _a2.label = 1;
        case 1:
          if (!(!condition || condition(state))) return [3, 4];
          return [4, resultSelector(state)];
        case 2:
          _a2.sent();
          _a2.label = 3;
        case 3:
          state = iterate(state);
          return [3, 1];
        case 4:
          return [2];
      }
    });
  }
  return defer_1$1.defer(scheduler ? function() {
    return scheduleIterable_1.scheduleIterable(gen(), scheduler);
  } : gen);
}
generate$1.generate = generate;
var iif$1 = {};
Object.defineProperty(iif$1, "__esModule", { value: true });
iif$1.iif = void 0;
var defer_1 = defer$1;
function iif(condition, trueResult, falseResult) {
  return defer_1.defer(function() {
    return condition() ? trueResult : falseResult;
  });
}
iif$1.iif = iif;
var interval$1 = {};
var timer$1 = {};
Object.defineProperty(timer$1, "__esModule", { value: true });
timer$1.timer = void 0;
var Observable_1$7 = Observable$1;
var async_1$a = async;
var isScheduler_1 = isScheduler$1;
var isDate_1$1 = isDate;
function timer(dueTime, intervalOrScheduler, scheduler) {
  if (dueTime === void 0) {
    dueTime = 0;
  }
  if (scheduler === void 0) {
    scheduler = async_1$a.async;
  }
  var intervalDuration = -1;
  if (intervalOrScheduler != null) {
    if (isScheduler_1.isScheduler(intervalOrScheduler)) {
      scheduler = intervalOrScheduler;
    } else {
      intervalDuration = intervalOrScheduler;
    }
  }
  return new Observable_1$7.Observable(function(subscriber) {
    var due = isDate_1$1.isValidDate(dueTime) ? +dueTime - scheduler.now() : dueTime;
    if (due < 0) {
      due = 0;
    }
    var n2 = 0;
    return scheduler.schedule(function() {
      if (!subscriber.closed) {
        subscriber.next(n2++);
        if (0 <= intervalDuration) {
          this.schedule(void 0, intervalDuration);
        } else {
          subscriber.complete();
        }
      }
    }, due);
  });
}
timer$1.timer = timer;
Object.defineProperty(interval$1, "__esModule", { value: true });
interval$1.interval = void 0;
var async_1$9 = async;
var timer_1$5 = timer$1;
function interval(period, scheduler) {
  if (period === void 0) {
    period = 0;
  }
  if (scheduler === void 0) {
    scheduler = async_1$9.asyncScheduler;
  }
  if (period < 0) {
    period = 0;
  }
  return timer_1$5.timer(period, period, scheduler);
}
interval$1.interval = interval;
var merge$3 = {};
Object.defineProperty(merge$3, "__esModule", { value: true });
merge$3.merge = void 0;
var mergeAll_1$1 = mergeAll$1;
var innerFrom_1$v = innerFrom$1;
var empty_1$6 = empty;
var args_1$8 = args;
var from_1$3 = from$1;
function merge$2() {
  var args2 = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args2[_i] = arguments[_i];
  }
  var scheduler = args_1$8.popScheduler(args2);
  var concurrent = args_1$8.popNumber(args2, Infinity);
  var sources = args2;
  return !sources.length ? empty_1$6.EMPTY : sources.length === 1 ? innerFrom_1$v.innerFrom(sources[0]) : mergeAll_1$1.mergeAll(concurrent)(from_1$3.from(sources, scheduler));
}
merge$3.merge = merge$2;
var never = {};
(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.never = exports.NEVER = void 0;
  var Observable_12 = Observable$1;
  var noop_12 = noop$1;
  exports.NEVER = new Observable_12.Observable(noop_12.noop);
  function never2() {
    return exports.NEVER;
  }
  exports.never = never2;
})(never);
var onErrorResumeNext$1 = {};
var argsOrArgArray$1 = {};
Object.defineProperty(argsOrArgArray$1, "__esModule", { value: true });
argsOrArgArray$1.argsOrArgArray = void 0;
var isArray = Array.isArray;
function argsOrArgArray(args2) {
  return args2.length === 1 && isArray(args2[0]) ? args2[0] : args2;
}
argsOrArgArray$1.argsOrArgArray = argsOrArgArray;
Object.defineProperty(onErrorResumeNext$1, "__esModule", { value: true });
onErrorResumeNext$1.onErrorResumeNext = void 0;
var Observable_1$6 = Observable$1;
var argsOrArgArray_1$5 = argsOrArgArray$1;
var OperatorSubscriber_1$O = OperatorSubscriber$1;
var noop_1$c = noop$1;
var innerFrom_1$u = innerFrom$1;
function onErrorResumeNext() {
  var sources = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    sources[_i] = arguments[_i];
  }
  var nextSources = argsOrArgArray_1$5.argsOrArgArray(sources);
  return new Observable_1$6.Observable(function(subscriber) {
    var sourceIndex = 0;
    var subscribeNext = function() {
      if (sourceIndex < nextSources.length) {
        var nextSource = void 0;
        try {
          nextSource = innerFrom_1$u.innerFrom(nextSources[sourceIndex++]);
        } catch (err) {
          subscribeNext();
          return;
        }
        var innerSubscriber = new OperatorSubscriber_1$O.OperatorSubscriber(subscriber, void 0, noop_1$c.noop, noop_1$c.noop);
        nextSource.subscribe(innerSubscriber);
        innerSubscriber.add(subscribeNext);
      } else {
        subscriber.complete();
      }
    };
    subscribeNext();
  });
}
onErrorResumeNext$1.onErrorResumeNext = onErrorResumeNext;
var pairs$1 = {};
Object.defineProperty(pairs$1, "__esModule", { value: true });
pairs$1.pairs = void 0;
var from_1$2 = from$1;
function pairs(obj, scheduler) {
  return from_1$2.from(Object.entries(obj), scheduler);
}
pairs$1.pairs = pairs;
var partition$1 = {};
var not$1 = {};
Object.defineProperty(not$1, "__esModule", { value: true });
not$1.not = void 0;
function not(pred, thisArg) {
  return function(value, index) {
    return !pred.call(thisArg, value, index);
  };
}
not$1.not = not;
var filter$1 = {};
Object.defineProperty(filter$1, "__esModule", { value: true });
filter$1.filter = void 0;
var lift_1$_ = lift;
var OperatorSubscriber_1$N = OperatorSubscriber$1;
function filter(predicate, thisArg) {
  return lift_1$_.operate(function(source, subscriber) {
    var index = 0;
    source.subscribe(OperatorSubscriber_1$N.createOperatorSubscriber(subscriber, function(value) {
      return predicate.call(thisArg, value, index++) && subscriber.next(value);
    }));
  });
}
filter$1.filter = filter;
Object.defineProperty(partition$1, "__esModule", { value: true });
partition$1.partition = void 0;
var not_1 = not$1;
var filter_1$4 = filter$1;
var innerFrom_1$t = innerFrom$1;
function partition(source, predicate, thisArg) {
  return [filter_1$4.filter(predicate, thisArg)(innerFrom_1$t.innerFrom(source)), filter_1$4.filter(not_1.not(predicate, thisArg))(innerFrom_1$t.innerFrom(source))];
}
partition$1.partition = partition;
var race$1 = {};
Object.defineProperty(race$1, "__esModule", { value: true });
race$1.raceInit = race$1.race = void 0;
var Observable_1$5 = Observable$1;
var innerFrom_1$s = innerFrom$1;
var argsOrArgArray_1$4 = argsOrArgArray$1;
var OperatorSubscriber_1$M = OperatorSubscriber$1;
function race() {
  var sources = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    sources[_i] = arguments[_i];
  }
  sources = argsOrArgArray_1$4.argsOrArgArray(sources);
  return sources.length === 1 ? innerFrom_1$s.innerFrom(sources[0]) : new Observable_1$5.Observable(raceInit(sources));
}
race$1.race = race;
function raceInit(sources) {
  return function(subscriber) {
    var subscriptions = [];
    var _loop_1 = function(i2) {
      subscriptions.push(innerFrom_1$s.innerFrom(sources[i2]).subscribe(OperatorSubscriber_1$M.createOperatorSubscriber(subscriber, function(value) {
        if (subscriptions) {
          for (var s = 0; s < subscriptions.length; s++) {
            s !== i2 && subscriptions[s].unsubscribe();
          }
          subscriptions = null;
        }
        subscriber.next(value);
      })));
    };
    for (var i = 0; subscriptions && !subscriber.closed && i < sources.length; i++) {
      _loop_1(i);
    }
  };
}
race$1.raceInit = raceInit;
var range$1 = {};
Object.defineProperty(range$1, "__esModule", { value: true });
range$1.range = void 0;
var Observable_1$4 = Observable$1;
var empty_1$5 = empty;
function range(start, count2, scheduler) {
  if (count2 == null) {
    count2 = start;
    start = 0;
  }
  if (count2 <= 0) {
    return empty_1$5.EMPTY;
  }
  var end = count2 + start;
  return new Observable_1$4.Observable(scheduler ? function(subscriber) {
    var n2 = start;
    return scheduler.schedule(function() {
      if (n2 < end) {
        subscriber.next(n2++);
        this.schedule();
      } else {
        subscriber.complete();
      }
    });
  } : function(subscriber) {
    var n2 = start;
    while (n2 < end && !subscriber.closed) {
      subscriber.next(n2++);
    }
    subscriber.complete();
  });
}
range$1.range = range;
var using$1 = {};
Object.defineProperty(using$1, "__esModule", { value: true });
using$1.using = void 0;
var Observable_1$3 = Observable$1;
var innerFrom_1$r = innerFrom$1;
var empty_1$4 = empty;
function using(resourceFactory, observableFactory) {
  return new Observable_1$3.Observable(function(subscriber) {
    var resource = resourceFactory();
    var result = observableFactory(resource);
    var source = result ? innerFrom_1$r.innerFrom(result) : empty_1$4.EMPTY;
    source.subscribe(subscriber);
    return function() {
      if (resource) {
        resource.unsubscribe();
      }
    };
  });
}
using$1.using = using;
var zip$3 = {};
var __read$d = commonjsGlobal && commonjsGlobal.__read || function(o, n2) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
    while ((n2 === void 0 || n2-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar;
};
var __spreadArray$d = commonjsGlobal && commonjsGlobal.__spreadArray || function(to, from2) {
  for (var i = 0, il = from2.length, j2 = to.length; i < il; i++, j2++)
    to[j2] = from2[i];
  return to;
};
Object.defineProperty(zip$3, "__esModule", { value: true });
zip$3.zip = void 0;
var Observable_1$2 = Observable$1;
var innerFrom_1$q = innerFrom$1;
var argsOrArgArray_1$3 = argsOrArgArray$1;
var empty_1$3 = empty;
var OperatorSubscriber_1$L = OperatorSubscriber$1;
var args_1$7 = args;
function zip$2() {
  var args2 = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args2[_i] = arguments[_i];
  }
  var resultSelector = args_1$7.popResultSelector(args2);
  var sources = argsOrArgArray_1$3.argsOrArgArray(args2);
  return sources.length ? new Observable_1$2.Observable(function(subscriber) {
    var buffers = sources.map(function() {
      return [];
    });
    var completed = sources.map(function() {
      return false;
    });
    subscriber.add(function() {
      buffers = completed = null;
    });
    var _loop_1 = function(sourceIndex2) {
      innerFrom_1$q.innerFrom(sources[sourceIndex2]).subscribe(OperatorSubscriber_1$L.createOperatorSubscriber(subscriber, function(value) {
        buffers[sourceIndex2].push(value);
        if (buffers.every(function(buffer2) {
          return buffer2.length;
        })) {
          var result = buffers.map(function(buffer2) {
            return buffer2.shift();
          });
          subscriber.next(resultSelector ? resultSelector.apply(void 0, __spreadArray$d([], __read$d(result))) : result);
          if (buffers.some(function(buffer2, i) {
            return !buffer2.length && completed[i];
          })) {
            subscriber.complete();
          }
        }
      }, function() {
        completed[sourceIndex2] = true;
        !buffers[sourceIndex2].length && subscriber.complete();
      }));
    };
    for (var sourceIndex = 0; !subscriber.closed && sourceIndex < sources.length; sourceIndex++) {
      _loop_1(sourceIndex);
    }
    return function() {
      buffers = completed = null;
    };
  }) : empty_1$3.EMPTY;
}
zip$3.zip = zip$2;
var types = {};
Object.defineProperty(types, "__esModule", { value: true });
var audit$1 = {};
Object.defineProperty(audit$1, "__esModule", { value: true });
audit$1.audit = void 0;
var lift_1$Z = lift;
var innerFrom_1$p = innerFrom$1;
var OperatorSubscriber_1$K = OperatorSubscriber$1;
function audit(durationSelector) {
  return lift_1$Z.operate(function(source, subscriber) {
    var hasValue = false;
    var lastValue = null;
    var durationSubscriber = null;
    var isComplete = false;
    var endDuration = function() {
      durationSubscriber === null || durationSubscriber === void 0 ? void 0 : durationSubscriber.unsubscribe();
      durationSubscriber = null;
      if (hasValue) {
        hasValue = false;
        var value = lastValue;
        lastValue = null;
        subscriber.next(value);
      }
      isComplete && subscriber.complete();
    };
    var cleanupDuration = function() {
      durationSubscriber = null;
      isComplete && subscriber.complete();
    };
    source.subscribe(OperatorSubscriber_1$K.createOperatorSubscriber(subscriber, function(value) {
      hasValue = true;
      lastValue = value;
      if (!durationSubscriber) {
        innerFrom_1$p.innerFrom(durationSelector(value)).subscribe(durationSubscriber = OperatorSubscriber_1$K.createOperatorSubscriber(subscriber, endDuration, cleanupDuration));
      }
    }, function() {
      isComplete = true;
      (!hasValue || !durationSubscriber || durationSubscriber.closed) && subscriber.complete();
    }));
  });
}
audit$1.audit = audit;
var auditTime$1 = {};
Object.defineProperty(auditTime$1, "__esModule", { value: true });
auditTime$1.auditTime = void 0;
var async_1$8 = async;
var audit_1 = audit$1;
var timer_1$4 = timer$1;
function auditTime(duration, scheduler) {
  if (scheduler === void 0) {
    scheduler = async_1$8.asyncScheduler;
  }
  return audit_1.audit(function() {
    return timer_1$4.timer(duration, scheduler);
  });
}
auditTime$1.auditTime = auditTime;
var buffer$1 = {};
Object.defineProperty(buffer$1, "__esModule", { value: true });
buffer$1.buffer = void 0;
var lift_1$Y = lift;
var noop_1$b = noop$1;
var OperatorSubscriber_1$J = OperatorSubscriber$1;
var innerFrom_1$o = innerFrom$1;
function buffer(closingNotifier) {
  return lift_1$Y.operate(function(source, subscriber) {
    var currentBuffer = [];
    source.subscribe(OperatorSubscriber_1$J.createOperatorSubscriber(subscriber, function(value) {
      return currentBuffer.push(value);
    }, function() {
      subscriber.next(currentBuffer);
      subscriber.complete();
    }));
    innerFrom_1$o.innerFrom(closingNotifier).subscribe(OperatorSubscriber_1$J.createOperatorSubscriber(subscriber, function() {
      var b = currentBuffer;
      currentBuffer = [];
      subscriber.next(b);
    }, noop_1$b.noop));
    return function() {
      currentBuffer = null;
    };
  });
}
buffer$1.buffer = buffer;
var bufferCount$1 = {};
var __values$5 = commonjsGlobal && commonjsGlobal.__values || function(o) {
  var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
    next: function() {
      if (o && i >= o.length) o = void 0;
      return { value: o && o[i++], done: !o };
    }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(bufferCount$1, "__esModule", { value: true });
bufferCount$1.bufferCount = void 0;
var lift_1$X = lift;
var OperatorSubscriber_1$I = OperatorSubscriber$1;
var arrRemove_1$4 = arrRemove$1;
function bufferCount(bufferSize, startBufferEvery) {
  if (startBufferEvery === void 0) {
    startBufferEvery = null;
  }
  startBufferEvery = startBufferEvery !== null && startBufferEvery !== void 0 ? startBufferEvery : bufferSize;
  return lift_1$X.operate(function(source, subscriber) {
    var buffers = [];
    var count2 = 0;
    source.subscribe(OperatorSubscriber_1$I.createOperatorSubscriber(subscriber, function(value) {
      var e_1, _a, e_2, _b;
      var toEmit = null;
      if (count2++ % startBufferEvery === 0) {
        buffers.push([]);
      }
      try {
        for (var buffers_1 = __values$5(buffers), buffers_1_1 = buffers_1.next(); !buffers_1_1.done; buffers_1_1 = buffers_1.next()) {
          var buffer2 = buffers_1_1.value;
          buffer2.push(value);
          if (bufferSize <= buffer2.length) {
            toEmit = toEmit !== null && toEmit !== void 0 ? toEmit : [];
            toEmit.push(buffer2);
          }
        }
      } catch (e_1_1) {
        e_1 = { error: e_1_1 };
      } finally {
        try {
          if (buffers_1_1 && !buffers_1_1.done && (_a = buffers_1.return)) _a.call(buffers_1);
        } finally {
          if (e_1) throw e_1.error;
        }
      }
      if (toEmit) {
        try {
          for (var toEmit_1 = __values$5(toEmit), toEmit_1_1 = toEmit_1.next(); !toEmit_1_1.done; toEmit_1_1 = toEmit_1.next()) {
            var buffer2 = toEmit_1_1.value;
            arrRemove_1$4.arrRemove(buffers, buffer2);
            subscriber.next(buffer2);
          }
        } catch (e_2_1) {
          e_2 = { error: e_2_1 };
        } finally {
          try {
            if (toEmit_1_1 && !toEmit_1_1.done && (_b = toEmit_1.return)) _b.call(toEmit_1);
          } finally {
            if (e_2) throw e_2.error;
          }
        }
      }
    }, function() {
      var e_3, _a;
      try {
        for (var buffers_2 = __values$5(buffers), buffers_2_1 = buffers_2.next(); !buffers_2_1.done; buffers_2_1 = buffers_2.next()) {
          var buffer2 = buffers_2_1.value;
          subscriber.next(buffer2);
        }
      } catch (e_3_1) {
        e_3 = { error: e_3_1 };
      } finally {
        try {
          if (buffers_2_1 && !buffers_2_1.done && (_a = buffers_2.return)) _a.call(buffers_2);
        } finally {
          if (e_3) throw e_3.error;
        }
      }
      subscriber.complete();
    }, void 0, function() {
      buffers = null;
    }));
  });
}
bufferCount$1.bufferCount = bufferCount;
var bufferTime$1 = {};
var __values$4 = commonjsGlobal && commonjsGlobal.__values || function(o) {
  var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
    next: function() {
      if (o && i >= o.length) o = void 0;
      return { value: o && o[i++], done: !o };
    }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(bufferTime$1, "__esModule", { value: true });
bufferTime$1.bufferTime = void 0;
var Subscription_1$3 = Subscription$1;
var lift_1$W = lift;
var OperatorSubscriber_1$H = OperatorSubscriber$1;
var arrRemove_1$3 = arrRemove$1;
var async_1$7 = async;
var args_1$6 = args;
var executeSchedule_1$1 = executeSchedule$1;
function bufferTime(bufferTimeSpan) {
  var _a, _b;
  var otherArgs = [];
  for (var _i = 1; _i < arguments.length; _i++) {
    otherArgs[_i - 1] = arguments[_i];
  }
  var scheduler = (_a = args_1$6.popScheduler(otherArgs)) !== null && _a !== void 0 ? _a : async_1$7.asyncScheduler;
  var bufferCreationInterval = (_b = otherArgs[0]) !== null && _b !== void 0 ? _b : null;
  var maxBufferSize = otherArgs[1] || Infinity;
  return lift_1$W.operate(function(source, subscriber) {
    var bufferRecords = [];
    var restartOnEmit = false;
    var emit2 = function(record) {
      var buffer2 = record.buffer, subs = record.subs;
      subs.unsubscribe();
      arrRemove_1$3.arrRemove(bufferRecords, record);
      subscriber.next(buffer2);
      restartOnEmit && startBuffer();
    };
    var startBuffer = function() {
      if (bufferRecords) {
        var subs = new Subscription_1$3.Subscription();
        subscriber.add(subs);
        var buffer2 = [];
        var record_1 = {
          buffer: buffer2,
          subs
        };
        bufferRecords.push(record_1);
        executeSchedule_1$1.executeSchedule(subs, scheduler, function() {
          return emit2(record_1);
        }, bufferTimeSpan);
      }
    };
    if (bufferCreationInterval !== null && bufferCreationInterval >= 0) {
      executeSchedule_1$1.executeSchedule(subscriber, scheduler, startBuffer, bufferCreationInterval, true);
    } else {
      restartOnEmit = true;
    }
    startBuffer();
    var bufferTimeSubscriber = OperatorSubscriber_1$H.createOperatorSubscriber(subscriber, function(value) {
      var e_1, _a2;
      var recordsCopy = bufferRecords.slice();
      try {
        for (var recordsCopy_1 = __values$4(recordsCopy), recordsCopy_1_1 = recordsCopy_1.next(); !recordsCopy_1_1.done; recordsCopy_1_1 = recordsCopy_1.next()) {
          var record = recordsCopy_1_1.value;
          var buffer2 = record.buffer;
          buffer2.push(value);
          maxBufferSize <= buffer2.length && emit2(record);
        }
      } catch (e_1_1) {
        e_1 = { error: e_1_1 };
      } finally {
        try {
          if (recordsCopy_1_1 && !recordsCopy_1_1.done && (_a2 = recordsCopy_1.return)) _a2.call(recordsCopy_1);
        } finally {
          if (e_1) throw e_1.error;
        }
      }
    }, function() {
      while (bufferRecords === null || bufferRecords === void 0 ? void 0 : bufferRecords.length) {
        subscriber.next(bufferRecords.shift().buffer);
      }
      bufferTimeSubscriber === null || bufferTimeSubscriber === void 0 ? void 0 : bufferTimeSubscriber.unsubscribe();
      subscriber.complete();
      subscriber.unsubscribe();
    }, void 0, function() {
      return bufferRecords = null;
    });
    source.subscribe(bufferTimeSubscriber);
  });
}
bufferTime$1.bufferTime = bufferTime;
var bufferToggle$1 = {};
var __values$3 = commonjsGlobal && commonjsGlobal.__values || function(o) {
  var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
    next: function() {
      if (o && i >= o.length) o = void 0;
      return { value: o && o[i++], done: !o };
    }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(bufferToggle$1, "__esModule", { value: true });
bufferToggle$1.bufferToggle = void 0;
var Subscription_1$2 = Subscription$1;
var lift_1$V = lift;
var innerFrom_1$n = innerFrom$1;
var OperatorSubscriber_1$G = OperatorSubscriber$1;
var noop_1$a = noop$1;
var arrRemove_1$2 = arrRemove$1;
function bufferToggle(openings, closingSelector) {
  return lift_1$V.operate(function(source, subscriber) {
    var buffers = [];
    innerFrom_1$n.innerFrom(openings).subscribe(OperatorSubscriber_1$G.createOperatorSubscriber(subscriber, function(openValue) {
      var buffer2 = [];
      buffers.push(buffer2);
      var closingSubscription = new Subscription_1$2.Subscription();
      var emitBuffer = function() {
        arrRemove_1$2.arrRemove(buffers, buffer2);
        subscriber.next(buffer2);
        closingSubscription.unsubscribe();
      };
      closingSubscription.add(innerFrom_1$n.innerFrom(closingSelector(openValue)).subscribe(OperatorSubscriber_1$G.createOperatorSubscriber(subscriber, emitBuffer, noop_1$a.noop)));
    }, noop_1$a.noop));
    source.subscribe(OperatorSubscriber_1$G.createOperatorSubscriber(subscriber, function(value) {
      var e_1, _a;
      try {
        for (var buffers_1 = __values$3(buffers), buffers_1_1 = buffers_1.next(); !buffers_1_1.done; buffers_1_1 = buffers_1.next()) {
          var buffer2 = buffers_1_1.value;
          buffer2.push(value);
        }
      } catch (e_1_1) {
        e_1 = { error: e_1_1 };
      } finally {
        try {
          if (buffers_1_1 && !buffers_1_1.done && (_a = buffers_1.return)) _a.call(buffers_1);
        } finally {
          if (e_1) throw e_1.error;
        }
      }
    }, function() {
      while (buffers.length > 0) {
        subscriber.next(buffers.shift());
      }
      subscriber.complete();
    }));
  });
}
bufferToggle$1.bufferToggle = bufferToggle;
var bufferWhen$1 = {};
Object.defineProperty(bufferWhen$1, "__esModule", { value: true });
bufferWhen$1.bufferWhen = void 0;
var lift_1$U = lift;
var noop_1$9 = noop$1;
var OperatorSubscriber_1$F = OperatorSubscriber$1;
var innerFrom_1$m = innerFrom$1;
function bufferWhen(closingSelector) {
  return lift_1$U.operate(function(source, subscriber) {
    var buffer2 = null;
    var closingSubscriber = null;
    var openBuffer = function() {
      closingSubscriber === null || closingSubscriber === void 0 ? void 0 : closingSubscriber.unsubscribe();
      var b = buffer2;
      buffer2 = [];
      b && subscriber.next(b);
      innerFrom_1$m.innerFrom(closingSelector()).subscribe(closingSubscriber = OperatorSubscriber_1$F.createOperatorSubscriber(subscriber, openBuffer, noop_1$9.noop));
    };
    openBuffer();
    source.subscribe(OperatorSubscriber_1$F.createOperatorSubscriber(subscriber, function(value) {
      return buffer2 === null || buffer2 === void 0 ? void 0 : buffer2.push(value);
    }, function() {
      buffer2 && subscriber.next(buffer2);
      subscriber.complete();
    }, void 0, function() {
      return buffer2 = closingSubscriber = null;
    }));
  });
}
bufferWhen$1.bufferWhen = bufferWhen;
var catchError$1 = {};
Object.defineProperty(catchError$1, "__esModule", { value: true });
catchError$1.catchError = void 0;
var innerFrom_1$l = innerFrom$1;
var OperatorSubscriber_1$E = OperatorSubscriber$1;
var lift_1$T = lift;
function catchError(selector) {
  return lift_1$T.operate(function(source, subscriber) {
    var innerSub = null;
    var syncUnsub = false;
    var handledResult;
    innerSub = source.subscribe(OperatorSubscriber_1$E.createOperatorSubscriber(subscriber, void 0, void 0, function(err) {
      handledResult = innerFrom_1$l.innerFrom(selector(err, catchError(selector)(source)));
      if (innerSub) {
        innerSub.unsubscribe();
        innerSub = null;
        handledResult.subscribe(subscriber);
      } else {
        syncUnsub = true;
      }
    }));
    if (syncUnsub) {
      innerSub.unsubscribe();
      innerSub = null;
      handledResult.subscribe(subscriber);
    }
  });
}
catchError$1.catchError = catchError;
var combineAll = {};
var combineLatestAll$1 = {};
var joinAllInternals$1 = {};
var toArray$1 = {};
var reduce$1 = {};
var scanInternals$1 = {};
Object.defineProperty(scanInternals$1, "__esModule", { value: true });
scanInternals$1.scanInternals = void 0;
var OperatorSubscriber_1$D = OperatorSubscriber$1;
function scanInternals(accumulator, seed, hasSeed, emitOnNext, emitBeforeComplete) {
  return function(source, subscriber) {
    var hasState = hasSeed;
    var state = seed;
    var index = 0;
    source.subscribe(OperatorSubscriber_1$D.createOperatorSubscriber(subscriber, function(value) {
      var i = index++;
      state = hasState ? accumulator(state, value, i) : (hasState = true, value);
      emitOnNext && subscriber.next(state);
    }, emitBeforeComplete && function() {
      hasState && subscriber.next(state);
      subscriber.complete();
    }));
  };
}
scanInternals$1.scanInternals = scanInternals;
Object.defineProperty(reduce$1, "__esModule", { value: true });
reduce$1.reduce = void 0;
var scanInternals_1$1 = scanInternals$1;
var lift_1$S = lift;
function reduce(accumulator, seed) {
  return lift_1$S.operate(scanInternals_1$1.scanInternals(accumulator, seed, arguments.length >= 2, false, true));
}
reduce$1.reduce = reduce;
Object.defineProperty(toArray$1, "__esModule", { value: true });
toArray$1.toArray = void 0;
var reduce_1$3 = reduce$1;
var lift_1$R = lift;
var arrReducer = function(arr, value) {
  return arr.push(value), arr;
};
function toArray() {
  return lift_1$R.operate(function(source, subscriber) {
    reduce_1$3.reduce(arrReducer, [])(source).subscribe(subscriber);
  });
}
toArray$1.toArray = toArray;
Object.defineProperty(joinAllInternals$1, "__esModule", { value: true });
joinAllInternals$1.joinAllInternals = void 0;
var identity_1$a = identity$1;
var mapOneOrManyArgs_1$1 = mapOneOrManyArgs$1;
var pipe_1$1 = pipe$1;
var mergeMap_1$4 = mergeMap$1;
var toArray_1 = toArray$1;
function joinAllInternals(joinFn, project) {
  return pipe_1$1.pipe(toArray_1.toArray(), mergeMap_1$4.mergeMap(function(sources) {
    return joinFn(sources);
  }), project ? mapOneOrManyArgs_1$1.mapOneOrManyArgs(project) : identity_1$a.identity);
}
joinAllInternals$1.joinAllInternals = joinAllInternals;
Object.defineProperty(combineLatestAll$1, "__esModule", { value: true });
combineLatestAll$1.combineLatestAll = void 0;
var combineLatest_1$2 = combineLatest$3;
var joinAllInternals_1$1 = joinAllInternals$1;
function combineLatestAll(project) {
  return joinAllInternals_1$1.joinAllInternals(combineLatest_1$2.combineLatest, project);
}
combineLatestAll$1.combineLatestAll = combineLatestAll;
Object.defineProperty(combineAll, "__esModule", { value: true });
combineAll.combineAll = void 0;
var combineLatestAll_1 = combineLatestAll$1;
combineAll.combineAll = combineLatestAll_1.combineLatestAll;
var combineLatestWith$1 = {};
var combineLatest$1 = {};
var __read$c = commonjsGlobal && commonjsGlobal.__read || function(o, n2) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
    while ((n2 === void 0 || n2-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar;
};
var __spreadArray$c = commonjsGlobal && commonjsGlobal.__spreadArray || function(to, from2) {
  for (var i = 0, il = from2.length, j2 = to.length; i < il; i++, j2++)
    to[j2] = from2[i];
  return to;
};
Object.defineProperty(combineLatest$1, "__esModule", { value: true });
combineLatest$1.combineLatest = void 0;
var combineLatest_1$1 = combineLatest$3;
var lift_1$Q = lift;
var argsOrArgArray_1$2 = argsOrArgArray$1;
var mapOneOrManyArgs_1 = mapOneOrManyArgs$1;
var pipe_1 = pipe$1;
var args_1$5 = args;
function combineLatest() {
  var args2 = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args2[_i] = arguments[_i];
  }
  var resultSelector = args_1$5.popResultSelector(args2);
  return resultSelector ? pipe_1.pipe(combineLatest.apply(void 0, __spreadArray$c([], __read$c(args2))), mapOneOrManyArgs_1.mapOneOrManyArgs(resultSelector)) : lift_1$Q.operate(function(source, subscriber) {
    combineLatest_1$1.combineLatestInit(__spreadArray$c([source], __read$c(argsOrArgArray_1$2.argsOrArgArray(args2))))(subscriber);
  });
}
combineLatest$1.combineLatest = combineLatest;
var __read$b = commonjsGlobal && commonjsGlobal.__read || function(o, n2) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
    while ((n2 === void 0 || n2-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar;
};
var __spreadArray$b = commonjsGlobal && commonjsGlobal.__spreadArray || function(to, from2) {
  for (var i = 0, il = from2.length, j2 = to.length; i < il; i++, j2++)
    to[j2] = from2[i];
  return to;
};
Object.defineProperty(combineLatestWith$1, "__esModule", { value: true });
combineLatestWith$1.combineLatestWith = void 0;
var combineLatest_1 = combineLatest$1;
function combineLatestWith() {
  var otherSources = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    otherSources[_i] = arguments[_i];
  }
  return combineLatest_1.combineLatest.apply(void 0, __spreadArray$b([], __read$b(otherSources)));
}
combineLatestWith$1.combineLatestWith = combineLatestWith;
var concatMap$1 = {};
Object.defineProperty(concatMap$1, "__esModule", { value: true });
concatMap$1.concatMap = void 0;
var mergeMap_1$3 = mergeMap$1;
var isFunction_1$8 = isFunction$1;
function concatMap(project, resultSelector) {
  return isFunction_1$8.isFunction(resultSelector) ? mergeMap_1$3.mergeMap(project, resultSelector, 1) : mergeMap_1$3.mergeMap(project, 1);
}
concatMap$1.concatMap = concatMap;
var concatMapTo$1 = {};
Object.defineProperty(concatMapTo$1, "__esModule", { value: true });
concatMapTo$1.concatMapTo = void 0;
var concatMap_1 = concatMap$1;
var isFunction_1$7 = isFunction$1;
function concatMapTo(innerObservable, resultSelector) {
  return isFunction_1$7.isFunction(resultSelector) ? concatMap_1.concatMap(function() {
    return innerObservable;
  }, resultSelector) : concatMap_1.concatMap(function() {
    return innerObservable;
  });
}
concatMapTo$1.concatMapTo = concatMapTo;
var concatWith$1 = {};
var concat$1 = {};
var __read$a = commonjsGlobal && commonjsGlobal.__read || function(o, n2) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
    while ((n2 === void 0 || n2-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar;
};
var __spreadArray$a = commonjsGlobal && commonjsGlobal.__spreadArray || function(to, from2) {
  for (var i = 0, il = from2.length, j2 = to.length; i < il; i++, j2++)
    to[j2] = from2[i];
  return to;
};
Object.defineProperty(concat$1, "__esModule", { value: true });
concat$1.concat = void 0;
var lift_1$P = lift;
var concatAll_1 = concatAll$1;
var args_1$4 = args;
var from_1$1 = from$1;
function concat() {
  var args2 = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args2[_i] = arguments[_i];
  }
  var scheduler = args_1$4.popScheduler(args2);
  return lift_1$P.operate(function(source, subscriber) {
    concatAll_1.concatAll()(from_1$1.from(__spreadArray$a([source], __read$a(args2)), scheduler)).subscribe(subscriber);
  });
}
concat$1.concat = concat;
var __read$9 = commonjsGlobal && commonjsGlobal.__read || function(o, n2) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
    while ((n2 === void 0 || n2-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar;
};
var __spreadArray$9 = commonjsGlobal && commonjsGlobal.__spreadArray || function(to, from2) {
  for (var i = 0, il = from2.length, j2 = to.length; i < il; i++, j2++)
    to[j2] = from2[i];
  return to;
};
Object.defineProperty(concatWith$1, "__esModule", { value: true });
concatWith$1.concatWith = void 0;
var concat_1$3 = concat$1;
function concatWith() {
  var otherSources = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    otherSources[_i] = arguments[_i];
  }
  return concat_1$3.concat.apply(void 0, __spreadArray$9([], __read$9(otherSources)));
}
concatWith$1.concatWith = concatWith;
var connect$1 = {};
var fromSubscribable$1 = {};
Object.defineProperty(fromSubscribable$1, "__esModule", { value: true });
fromSubscribable$1.fromSubscribable = void 0;
var Observable_1$1 = Observable$1;
function fromSubscribable(subscribable) {
  return new Observable_1$1.Observable(function(subscriber) {
    return subscribable.subscribe(subscriber);
  });
}
fromSubscribable$1.fromSubscribable = fromSubscribable;
Object.defineProperty(connect$1, "__esModule", { value: true });
connect$1.connect = void 0;
var Subject_1$a = Subject$1;
var innerFrom_1$k = innerFrom$1;
var lift_1$O = lift;
var fromSubscribable_1 = fromSubscribable$1;
var DEFAULT_CONFIG = {
  connector: function() {
    return new Subject_1$a.Subject();
  }
};
function connect(selector, config2) {
  if (config2 === void 0) {
    config2 = DEFAULT_CONFIG;
  }
  var connector = config2.connector;
  return lift_1$O.operate(function(source, subscriber) {
    var subject = connector();
    innerFrom_1$k.innerFrom(selector(fromSubscribable_1.fromSubscribable(subject))).subscribe(subscriber);
    subscriber.add(source.subscribe(subject));
  });
}
connect$1.connect = connect;
var count$1 = {};
Object.defineProperty(count$1, "__esModule", { value: true });
count$1.count = void 0;
var reduce_1$2 = reduce$1;
function count(predicate) {
  return reduce_1$2.reduce(function(total, value, i) {
    return !predicate || predicate(value, i) ? total + 1 : total;
  }, 0);
}
count$1.count = count;
var debounce$1 = {};
Object.defineProperty(debounce$1, "__esModule", { value: true });
debounce$1.debounce = void 0;
var lift_1$N = lift;
var noop_1$8 = noop$1;
var OperatorSubscriber_1$C = OperatorSubscriber$1;
var innerFrom_1$j = innerFrom$1;
function debounce(durationSelector) {
  return lift_1$N.operate(function(source, subscriber) {
    var hasValue = false;
    var lastValue = null;
    var durationSubscriber = null;
    var emit2 = function() {
      durationSubscriber === null || durationSubscriber === void 0 ? void 0 : durationSubscriber.unsubscribe();
      durationSubscriber = null;
      if (hasValue) {
        hasValue = false;
        var value = lastValue;
        lastValue = null;
        subscriber.next(value);
      }
    };
    source.subscribe(OperatorSubscriber_1$C.createOperatorSubscriber(subscriber, function(value) {
      durationSubscriber === null || durationSubscriber === void 0 ? void 0 : durationSubscriber.unsubscribe();
      hasValue = true;
      lastValue = value;
      durationSubscriber = OperatorSubscriber_1$C.createOperatorSubscriber(subscriber, emit2, noop_1$8.noop);
      innerFrom_1$j.innerFrom(durationSelector(value)).subscribe(durationSubscriber);
    }, function() {
      emit2();
      subscriber.complete();
    }, void 0, function() {
      lastValue = durationSubscriber = null;
    }));
  });
}
debounce$1.debounce = debounce;
var debounceTime$1 = {};
Object.defineProperty(debounceTime$1, "__esModule", { value: true });
debounceTime$1.debounceTime = void 0;
var async_1$6 = async;
var lift_1$M = lift;
var OperatorSubscriber_1$B = OperatorSubscriber$1;
function debounceTime(dueTime, scheduler) {
  if (scheduler === void 0) {
    scheduler = async_1$6.asyncScheduler;
  }
  return lift_1$M.operate(function(source, subscriber) {
    var activeTask = null;
    var lastValue = null;
    var lastTime = null;
    var emit2 = function() {
      if (activeTask) {
        activeTask.unsubscribe();
        activeTask = null;
        var value = lastValue;
        lastValue = null;
        subscriber.next(value);
      }
    };
    function emitWhenIdle() {
      var targetTime = lastTime + dueTime;
      var now = scheduler.now();
      if (now < targetTime) {
        activeTask = this.schedule(void 0, targetTime - now);
        subscriber.add(activeTask);
        return;
      }
      emit2();
    }
    source.subscribe(OperatorSubscriber_1$B.createOperatorSubscriber(subscriber, function(value) {
      lastValue = value;
      lastTime = scheduler.now();
      if (!activeTask) {
        activeTask = scheduler.schedule(emitWhenIdle, dueTime);
        subscriber.add(activeTask);
      }
    }, function() {
      emit2();
      subscriber.complete();
    }, void 0, function() {
      lastValue = activeTask = null;
    }));
  });
}
debounceTime$1.debounceTime = debounceTime;
var defaultIfEmpty$1 = {};
Object.defineProperty(defaultIfEmpty$1, "__esModule", { value: true });
defaultIfEmpty$1.defaultIfEmpty = void 0;
var lift_1$L = lift;
var OperatorSubscriber_1$A = OperatorSubscriber$1;
function defaultIfEmpty(defaultValue) {
  return lift_1$L.operate(function(source, subscriber) {
    var hasValue = false;
    source.subscribe(OperatorSubscriber_1$A.createOperatorSubscriber(subscriber, function(value) {
      hasValue = true;
      subscriber.next(value);
    }, function() {
      if (!hasValue) {
        subscriber.next(defaultValue);
      }
      subscriber.complete();
    }));
  });
}
defaultIfEmpty$1.defaultIfEmpty = defaultIfEmpty;
var delay$1 = {};
var delayWhen$1 = {};
var take$1 = {};
Object.defineProperty(take$1, "__esModule", { value: true });
take$1.take = void 0;
var empty_1$2 = empty;
var lift_1$K = lift;
var OperatorSubscriber_1$z = OperatorSubscriber$1;
function take(count2) {
  return count2 <= 0 ? function() {
    return empty_1$2.EMPTY;
  } : lift_1$K.operate(function(source, subscriber) {
    var seen = 0;
    source.subscribe(OperatorSubscriber_1$z.createOperatorSubscriber(subscriber, function(value) {
      if (++seen <= count2) {
        subscriber.next(value);
        if (count2 <= seen) {
          subscriber.complete();
        }
      }
    }));
  });
}
take$1.take = take;
var ignoreElements$1 = {};
Object.defineProperty(ignoreElements$1, "__esModule", { value: true });
ignoreElements$1.ignoreElements = void 0;
var lift_1$J = lift;
var OperatorSubscriber_1$y = OperatorSubscriber$1;
var noop_1$7 = noop$1;
function ignoreElements() {
  return lift_1$J.operate(function(source, subscriber) {
    source.subscribe(OperatorSubscriber_1$y.createOperatorSubscriber(subscriber, noop_1$7.noop));
  });
}
ignoreElements$1.ignoreElements = ignoreElements;
var mapTo$1 = {};
Object.defineProperty(mapTo$1, "__esModule", { value: true });
mapTo$1.mapTo = void 0;
var map_1$3 = map$1;
function mapTo(value) {
  return map_1$3.map(function() {
    return value;
  });
}
mapTo$1.mapTo = mapTo;
Object.defineProperty(delayWhen$1, "__esModule", { value: true });
delayWhen$1.delayWhen = void 0;
var concat_1$2 = concat$3;
var take_1$2 = take$1;
var ignoreElements_1 = ignoreElements$1;
var mapTo_1 = mapTo$1;
var mergeMap_1$2 = mergeMap$1;
var innerFrom_1$i = innerFrom$1;
function delayWhen(delayDurationSelector, subscriptionDelay) {
  if (subscriptionDelay) {
    return function(source) {
      return concat_1$2.concat(subscriptionDelay.pipe(take_1$2.take(1), ignoreElements_1.ignoreElements()), source.pipe(delayWhen(delayDurationSelector)));
    };
  }
  return mergeMap_1$2.mergeMap(function(value, index) {
    return innerFrom_1$i.innerFrom(delayDurationSelector(value, index)).pipe(take_1$2.take(1), mapTo_1.mapTo(value));
  });
}
delayWhen$1.delayWhen = delayWhen;
Object.defineProperty(delay$1, "__esModule", { value: true });
delay$1.delay = void 0;
var async_1$5 = async;
var delayWhen_1 = delayWhen$1;
var timer_1$3 = timer$1;
function delay(due, scheduler) {
  if (scheduler === void 0) {
    scheduler = async_1$5.asyncScheduler;
  }
  var duration = timer_1$3.timer(due, scheduler);
  return delayWhen_1.delayWhen(function() {
    return duration;
  });
}
delay$1.delay = delay;
var dematerialize$1 = {};
Object.defineProperty(dematerialize$1, "__esModule", { value: true });
dematerialize$1.dematerialize = void 0;
var Notification_1$1 = Notification;
var lift_1$I = lift;
var OperatorSubscriber_1$x = OperatorSubscriber$1;
function dematerialize() {
  return lift_1$I.operate(function(source, subscriber) {
    source.subscribe(OperatorSubscriber_1$x.createOperatorSubscriber(subscriber, function(notification) {
      return Notification_1$1.observeNotification(notification, subscriber);
    }));
  });
}
dematerialize$1.dematerialize = dematerialize;
var distinct$1 = {};
Object.defineProperty(distinct$1, "__esModule", { value: true });
distinct$1.distinct = void 0;
var lift_1$H = lift;
var OperatorSubscriber_1$w = OperatorSubscriber$1;
var noop_1$6 = noop$1;
var innerFrom_1$h = innerFrom$1;
function distinct(keySelector, flushes) {
  return lift_1$H.operate(function(source, subscriber) {
    var distinctKeys = /* @__PURE__ */ new Set();
    source.subscribe(OperatorSubscriber_1$w.createOperatorSubscriber(subscriber, function(value) {
      var key = keySelector ? keySelector(value) : value;
      if (!distinctKeys.has(key)) {
        distinctKeys.add(key);
        subscriber.next(value);
      }
    }));
    flushes && innerFrom_1$h.innerFrom(flushes).subscribe(OperatorSubscriber_1$w.createOperatorSubscriber(subscriber, function() {
      return distinctKeys.clear();
    }, noop_1$6.noop));
  });
}
distinct$1.distinct = distinct;
var distinctUntilChanged$1 = {};
Object.defineProperty(distinctUntilChanged$1, "__esModule", { value: true });
distinctUntilChanged$1.distinctUntilChanged = void 0;
var identity_1$9 = identity$1;
var lift_1$G = lift;
var OperatorSubscriber_1$v = OperatorSubscriber$1;
function distinctUntilChanged(comparator, keySelector) {
  if (keySelector === void 0) {
    keySelector = identity_1$9.identity;
  }
  comparator = comparator !== null && comparator !== void 0 ? comparator : defaultCompare;
  return lift_1$G.operate(function(source, subscriber) {
    var previousKey;
    var first2 = true;
    source.subscribe(OperatorSubscriber_1$v.createOperatorSubscriber(subscriber, function(value) {
      var currentKey = keySelector(value);
      if (first2 || !comparator(previousKey, currentKey)) {
        first2 = false;
        previousKey = currentKey;
        subscriber.next(value);
      }
    }));
  });
}
distinctUntilChanged$1.distinctUntilChanged = distinctUntilChanged;
function defaultCompare(a, b) {
  return a === b;
}
var distinctUntilKeyChanged$1 = {};
Object.defineProperty(distinctUntilKeyChanged$1, "__esModule", { value: true });
distinctUntilKeyChanged$1.distinctUntilKeyChanged = void 0;
var distinctUntilChanged_1 = distinctUntilChanged$1;
function distinctUntilKeyChanged(key, compare) {
  return distinctUntilChanged_1.distinctUntilChanged(function(x2, y2) {
    return compare ? compare(x2[key], y2[key]) : x2[key] === y2[key];
  });
}
distinctUntilKeyChanged$1.distinctUntilKeyChanged = distinctUntilKeyChanged;
var elementAt$1 = {};
var throwIfEmpty$1 = {};
Object.defineProperty(throwIfEmpty$1, "__esModule", { value: true });
throwIfEmpty$1.throwIfEmpty = void 0;
var EmptyError_1$3 = EmptyError;
var lift_1$F = lift;
var OperatorSubscriber_1$u = OperatorSubscriber$1;
function throwIfEmpty(errorFactory) {
  if (errorFactory === void 0) {
    errorFactory = defaultErrorFactory;
  }
  return lift_1$F.operate(function(source, subscriber) {
    var hasValue = false;
    source.subscribe(OperatorSubscriber_1$u.createOperatorSubscriber(subscriber, function(value) {
      hasValue = true;
      subscriber.next(value);
    }, function() {
      return hasValue ? subscriber.complete() : subscriber.error(errorFactory());
    }));
  });
}
throwIfEmpty$1.throwIfEmpty = throwIfEmpty;
function defaultErrorFactory() {
  return new EmptyError_1$3.EmptyError();
}
Object.defineProperty(elementAt$1, "__esModule", { value: true });
elementAt$1.elementAt = void 0;
var ArgumentOutOfRangeError_1 = ArgumentOutOfRangeError;
var filter_1$3 = filter$1;
var throwIfEmpty_1$2 = throwIfEmpty$1;
var defaultIfEmpty_1$2 = defaultIfEmpty$1;
var take_1$1 = take$1;
function elementAt(index, defaultValue) {
  if (index < 0) {
    throw new ArgumentOutOfRangeError_1.ArgumentOutOfRangeError();
  }
  var hasDefaultValue = arguments.length >= 2;
  return function(source) {
    return source.pipe(filter_1$3.filter(function(v, i) {
      return i === index;
    }), take_1$1.take(1), hasDefaultValue ? defaultIfEmpty_1$2.defaultIfEmpty(defaultValue) : throwIfEmpty_1$2.throwIfEmpty(function() {
      return new ArgumentOutOfRangeError_1.ArgumentOutOfRangeError();
    }));
  };
}
elementAt$1.elementAt = elementAt;
var endWith$1 = {};
var __read$8 = commonjsGlobal && commonjsGlobal.__read || function(o, n2) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
    while ((n2 === void 0 || n2-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar;
};
var __spreadArray$8 = commonjsGlobal && commonjsGlobal.__spreadArray || function(to, from2) {
  for (var i = 0, il = from2.length, j2 = to.length; i < il; i++, j2++)
    to[j2] = from2[i];
  return to;
};
Object.defineProperty(endWith$1, "__esModule", { value: true });
endWith$1.endWith = void 0;
var concat_1$1 = concat$3;
var of_1 = of$1;
function endWith() {
  var values = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    values[_i] = arguments[_i];
  }
  return function(source) {
    return concat_1$1.concat(source, of_1.of.apply(void 0, __spreadArray$8([], __read$8(values))));
  };
}
endWith$1.endWith = endWith;
var every$1 = {};
Object.defineProperty(every$1, "__esModule", { value: true });
every$1.every = void 0;
var lift_1$E = lift;
var OperatorSubscriber_1$t = OperatorSubscriber$1;
function every(predicate, thisArg) {
  return lift_1$E.operate(function(source, subscriber) {
    var index = 0;
    source.subscribe(OperatorSubscriber_1$t.createOperatorSubscriber(subscriber, function(value) {
      if (!predicate.call(thisArg, value, index++, source)) {
        subscriber.next(false);
        subscriber.complete();
      }
    }, function() {
      subscriber.next(true);
      subscriber.complete();
    }));
  });
}
every$1.every = every;
var exhaust = {};
var exhaustAll$1 = {};
var exhaustMap$1 = {};
Object.defineProperty(exhaustMap$1, "__esModule", { value: true });
exhaustMap$1.exhaustMap = void 0;
var map_1$2 = map$1;
var innerFrom_1$g = innerFrom$1;
var lift_1$D = lift;
var OperatorSubscriber_1$s = OperatorSubscriber$1;
function exhaustMap(project, resultSelector) {
  if (resultSelector) {
    return function(source) {
      return source.pipe(exhaustMap(function(a, i) {
        return innerFrom_1$g.innerFrom(project(a, i)).pipe(map_1$2.map(function(b, ii) {
          return resultSelector(a, b, i, ii);
        }));
      }));
    };
  }
  return lift_1$D.operate(function(source, subscriber) {
    var index = 0;
    var innerSub = null;
    var isComplete = false;
    source.subscribe(OperatorSubscriber_1$s.createOperatorSubscriber(subscriber, function(outerValue) {
      if (!innerSub) {
        innerSub = OperatorSubscriber_1$s.createOperatorSubscriber(subscriber, void 0, function() {
          innerSub = null;
          isComplete && subscriber.complete();
        });
        innerFrom_1$g.innerFrom(project(outerValue, index++)).subscribe(innerSub);
      }
    }, function() {
      isComplete = true;
      !innerSub && subscriber.complete();
    }));
  });
}
exhaustMap$1.exhaustMap = exhaustMap;
Object.defineProperty(exhaustAll$1, "__esModule", { value: true });
exhaustAll$1.exhaustAll = void 0;
var exhaustMap_1 = exhaustMap$1;
var identity_1$8 = identity$1;
function exhaustAll() {
  return exhaustMap_1.exhaustMap(identity_1$8.identity);
}
exhaustAll$1.exhaustAll = exhaustAll;
Object.defineProperty(exhaust, "__esModule", { value: true });
exhaust.exhaust = void 0;
var exhaustAll_1 = exhaustAll$1;
exhaust.exhaust = exhaustAll_1.exhaustAll;
var expand$1 = {};
Object.defineProperty(expand$1, "__esModule", { value: true });
expand$1.expand = void 0;
var lift_1$C = lift;
var mergeInternals_1$1 = mergeInternals$1;
function expand(project, concurrent, scheduler) {
  if (concurrent === void 0) {
    concurrent = Infinity;
  }
  concurrent = (concurrent || 0) < 1 ? Infinity : concurrent;
  return lift_1$C.operate(function(source, subscriber) {
    return mergeInternals_1$1.mergeInternals(source, subscriber, project, concurrent, void 0, true, scheduler);
  });
}
expand$1.expand = expand;
var finalize$1 = {};
Object.defineProperty(finalize$1, "__esModule", { value: true });
finalize$1.finalize = void 0;
var lift_1$B = lift;
function finalize(callback) {
  return lift_1$B.operate(function(source, subscriber) {
    try {
      source.subscribe(subscriber);
    } finally {
      subscriber.add(callback);
    }
  });
}
finalize$1.finalize = finalize;
var find$1 = {};
Object.defineProperty(find$1, "__esModule", { value: true });
find$1.createFind = find$1.find = void 0;
var lift_1$A = lift;
var OperatorSubscriber_1$r = OperatorSubscriber$1;
function find(predicate, thisArg) {
  return lift_1$A.operate(createFind(predicate, thisArg, "value"));
}
find$1.find = find;
function createFind(predicate, thisArg, emit2) {
  var findIndex2 = emit2 === "index";
  return function(source, subscriber) {
    var index = 0;
    source.subscribe(OperatorSubscriber_1$r.createOperatorSubscriber(subscriber, function(value) {
      var i = index++;
      if (predicate.call(thisArg, value, i, source)) {
        subscriber.next(findIndex2 ? i : value);
        subscriber.complete();
      }
    }, function() {
      subscriber.next(findIndex2 ? -1 : void 0);
      subscriber.complete();
    }));
  };
}
find$1.createFind = createFind;
var findIndex$1 = {};
Object.defineProperty(findIndex$1, "__esModule", { value: true });
findIndex$1.findIndex = void 0;
var lift_1$z = lift;
var find_1 = find$1;
function findIndex(predicate, thisArg) {
  return lift_1$z.operate(find_1.createFind(predicate, thisArg, "index"));
}
findIndex$1.findIndex = findIndex;
var first$1 = {};
Object.defineProperty(first$1, "__esModule", { value: true });
first$1.first = void 0;
var EmptyError_1$2 = EmptyError;
var filter_1$2 = filter$1;
var take_1 = take$1;
var defaultIfEmpty_1$1 = defaultIfEmpty$1;
var throwIfEmpty_1$1 = throwIfEmpty$1;
var identity_1$7 = identity$1;
function first(predicate, defaultValue) {
  var hasDefaultValue = arguments.length >= 2;
  return function(source) {
    return source.pipe(predicate ? filter_1$2.filter(function(v, i) {
      return predicate(v, i, source);
    }) : identity_1$7.identity, take_1.take(1), hasDefaultValue ? defaultIfEmpty_1$1.defaultIfEmpty(defaultValue) : throwIfEmpty_1$1.throwIfEmpty(function() {
      return new EmptyError_1$2.EmptyError();
    }));
  };
}
first$1.first = first;
var groupBy$1 = {};
Object.defineProperty(groupBy$1, "__esModule", { value: true });
groupBy$1.groupBy = void 0;
var Observable_1 = Observable$1;
var innerFrom_1$f = innerFrom$1;
var Subject_1$9 = Subject$1;
var lift_1$y = lift;
var OperatorSubscriber_1$q = OperatorSubscriber$1;
function groupBy(keySelector, elementOrOptions, duration, connector) {
  return lift_1$y.operate(function(source, subscriber) {
    var element;
    if (!elementOrOptions || typeof elementOrOptions === "function") {
      element = elementOrOptions;
    } else {
      duration = elementOrOptions.duration, element = elementOrOptions.element, connector = elementOrOptions.connector;
    }
    var groups = /* @__PURE__ */ new Map();
    var notify = function(cb) {
      groups.forEach(cb);
      cb(subscriber);
    };
    var handleError = function(err) {
      return notify(function(consumer) {
        return consumer.error(err);
      });
    };
    var activeGroups = 0;
    var teardownAttempted = false;
    var groupBySourceSubscriber = new OperatorSubscriber_1$q.OperatorSubscriber(subscriber, function(value) {
      try {
        var key_1 = keySelector(value);
        var group_1 = groups.get(key_1);
        if (!group_1) {
          groups.set(key_1, group_1 = connector ? connector() : new Subject_1$9.Subject());
          var grouped = createGroupedObservable(key_1, group_1);
          subscriber.next(grouped);
          if (duration) {
            var durationSubscriber_1 = OperatorSubscriber_1$q.createOperatorSubscriber(group_1, function() {
              group_1.complete();
              durationSubscriber_1 === null || durationSubscriber_1 === void 0 ? void 0 : durationSubscriber_1.unsubscribe();
            }, void 0, void 0, function() {
              return groups.delete(key_1);
            });
            groupBySourceSubscriber.add(innerFrom_1$f.innerFrom(duration(grouped)).subscribe(durationSubscriber_1));
          }
        }
        group_1.next(element ? element(value) : value);
      } catch (err) {
        handleError(err);
      }
    }, function() {
      return notify(function(consumer) {
        return consumer.complete();
      });
    }, handleError, function() {
      return groups.clear();
    }, function() {
      teardownAttempted = true;
      return activeGroups === 0;
    });
    source.subscribe(groupBySourceSubscriber);
    function createGroupedObservable(key, groupSubject) {
      var result = new Observable_1.Observable(function(groupSubscriber) {
        activeGroups++;
        var innerSub = groupSubject.subscribe(groupSubscriber);
        return function() {
          innerSub.unsubscribe();
          --activeGroups === 0 && teardownAttempted && groupBySourceSubscriber.unsubscribe();
        };
      });
      result.key = key;
      return result;
    }
  });
}
groupBy$1.groupBy = groupBy;
var isEmpty$1 = {};
Object.defineProperty(isEmpty$1, "__esModule", { value: true });
isEmpty$1.isEmpty = void 0;
var lift_1$x = lift;
var OperatorSubscriber_1$p = OperatorSubscriber$1;
function isEmpty() {
  return lift_1$x.operate(function(source, subscriber) {
    source.subscribe(OperatorSubscriber_1$p.createOperatorSubscriber(subscriber, function() {
      subscriber.next(false);
      subscriber.complete();
    }, function() {
      subscriber.next(true);
      subscriber.complete();
    }));
  });
}
isEmpty$1.isEmpty = isEmpty;
var last$1 = {};
var takeLast$1 = {};
var __values$2 = commonjsGlobal && commonjsGlobal.__values || function(o) {
  var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
    next: function() {
      if (o && i >= o.length) o = void 0;
      return { value: o && o[i++], done: !o };
    }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(takeLast$1, "__esModule", { value: true });
takeLast$1.takeLast = void 0;
var empty_1$1 = empty;
var lift_1$w = lift;
var OperatorSubscriber_1$o = OperatorSubscriber$1;
function takeLast(count2) {
  return count2 <= 0 ? function() {
    return empty_1$1.EMPTY;
  } : lift_1$w.operate(function(source, subscriber) {
    var buffer2 = [];
    source.subscribe(OperatorSubscriber_1$o.createOperatorSubscriber(subscriber, function(value) {
      buffer2.push(value);
      count2 < buffer2.length && buffer2.shift();
    }, function() {
      var e_1, _a;
      try {
        for (var buffer_1 = __values$2(buffer2), buffer_1_1 = buffer_1.next(); !buffer_1_1.done; buffer_1_1 = buffer_1.next()) {
          var value = buffer_1_1.value;
          subscriber.next(value);
        }
      } catch (e_1_1) {
        e_1 = { error: e_1_1 };
      } finally {
        try {
          if (buffer_1_1 && !buffer_1_1.done && (_a = buffer_1.return)) _a.call(buffer_1);
        } finally {
          if (e_1) throw e_1.error;
        }
      }
      subscriber.complete();
    }, void 0, function() {
      buffer2 = null;
    }));
  });
}
takeLast$1.takeLast = takeLast;
Object.defineProperty(last$1, "__esModule", { value: true });
last$1.last = void 0;
var EmptyError_1$1 = EmptyError;
var filter_1$1 = filter$1;
var takeLast_1 = takeLast$1;
var throwIfEmpty_1 = throwIfEmpty$1;
var defaultIfEmpty_1 = defaultIfEmpty$1;
var identity_1$6 = identity$1;
function last(predicate, defaultValue) {
  var hasDefaultValue = arguments.length >= 2;
  return function(source) {
    return source.pipe(predicate ? filter_1$1.filter(function(v, i) {
      return predicate(v, i, source);
    }) : identity_1$6.identity, takeLast_1.takeLast(1), hasDefaultValue ? defaultIfEmpty_1.defaultIfEmpty(defaultValue) : throwIfEmpty_1.throwIfEmpty(function() {
      return new EmptyError_1$1.EmptyError();
    }));
  };
}
last$1.last = last;
var materialize$1 = {};
Object.defineProperty(materialize$1, "__esModule", { value: true });
materialize$1.materialize = void 0;
var Notification_1 = Notification;
var lift_1$v = lift;
var OperatorSubscriber_1$n = OperatorSubscriber$1;
function materialize() {
  return lift_1$v.operate(function(source, subscriber) {
    source.subscribe(OperatorSubscriber_1$n.createOperatorSubscriber(subscriber, function(value) {
      subscriber.next(Notification_1.Notification.createNext(value));
    }, function() {
      subscriber.next(Notification_1.Notification.createComplete());
      subscriber.complete();
    }, function(err) {
      subscriber.next(Notification_1.Notification.createError(err));
      subscriber.complete();
    }));
  });
}
materialize$1.materialize = materialize;
var max$1 = {};
Object.defineProperty(max$1, "__esModule", { value: true });
max$1.max = void 0;
var reduce_1$1 = reduce$1;
var isFunction_1$6 = isFunction$1;
function max(comparer) {
  return reduce_1$1.reduce(isFunction_1$6.isFunction(comparer) ? function(x2, y2) {
    return comparer(x2, y2) > 0 ? x2 : y2;
  } : function(x2, y2) {
    return x2 > y2 ? x2 : y2;
  });
}
max$1.max = max;
var flatMap = {};
Object.defineProperty(flatMap, "__esModule", { value: true });
flatMap.flatMap = void 0;
var mergeMap_1$1 = mergeMap$1;
flatMap.flatMap = mergeMap_1$1.mergeMap;
var mergeMapTo$1 = {};
Object.defineProperty(mergeMapTo$1, "__esModule", { value: true });
mergeMapTo$1.mergeMapTo = void 0;
var mergeMap_1 = mergeMap$1;
var isFunction_1$5 = isFunction$1;
function mergeMapTo(innerObservable, resultSelector, concurrent) {
  if (concurrent === void 0) {
    concurrent = Infinity;
  }
  if (isFunction_1$5.isFunction(resultSelector)) {
    return mergeMap_1.mergeMap(function() {
      return innerObservable;
    }, resultSelector, concurrent);
  }
  if (typeof resultSelector === "number") {
    concurrent = resultSelector;
  }
  return mergeMap_1.mergeMap(function() {
    return innerObservable;
  }, concurrent);
}
mergeMapTo$1.mergeMapTo = mergeMapTo;
var mergeScan$1 = {};
Object.defineProperty(mergeScan$1, "__esModule", { value: true });
mergeScan$1.mergeScan = void 0;
var lift_1$u = lift;
var mergeInternals_1 = mergeInternals$1;
function mergeScan(accumulator, seed, concurrent) {
  if (concurrent === void 0) {
    concurrent = Infinity;
  }
  return lift_1$u.operate(function(source, subscriber) {
    var state = seed;
    return mergeInternals_1.mergeInternals(source, subscriber, function(value, index) {
      return accumulator(state, value, index);
    }, concurrent, function(value) {
      state = value;
    }, false, void 0, function() {
      return state = null;
    });
  });
}
mergeScan$1.mergeScan = mergeScan;
var mergeWith$1 = {};
var merge$1 = {};
var __read$7 = commonjsGlobal && commonjsGlobal.__read || function(o, n2) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
    while ((n2 === void 0 || n2-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar;
};
var __spreadArray$7 = commonjsGlobal && commonjsGlobal.__spreadArray || function(to, from2) {
  for (var i = 0, il = from2.length, j2 = to.length; i < il; i++, j2++)
    to[j2] = from2[i];
  return to;
};
Object.defineProperty(merge$1, "__esModule", { value: true });
merge$1.merge = void 0;
var lift_1$t = lift;
var argsOrArgArray_1$1 = argsOrArgArray$1;
var mergeAll_1 = mergeAll$1;
var args_1$3 = args;
var from_1 = from$1;
function merge() {
  var args2 = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args2[_i] = arguments[_i];
  }
  var scheduler = args_1$3.popScheduler(args2);
  var concurrent = args_1$3.popNumber(args2, Infinity);
  args2 = argsOrArgArray_1$1.argsOrArgArray(args2);
  return lift_1$t.operate(function(source, subscriber) {
    mergeAll_1.mergeAll(concurrent)(from_1.from(__spreadArray$7([source], __read$7(args2)), scheduler)).subscribe(subscriber);
  });
}
merge$1.merge = merge;
var __read$6 = commonjsGlobal && commonjsGlobal.__read || function(o, n2) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
    while ((n2 === void 0 || n2-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar;
};
var __spreadArray$6 = commonjsGlobal && commonjsGlobal.__spreadArray || function(to, from2) {
  for (var i = 0, il = from2.length, j2 = to.length; i < il; i++, j2++)
    to[j2] = from2[i];
  return to;
};
Object.defineProperty(mergeWith$1, "__esModule", { value: true });
mergeWith$1.mergeWith = void 0;
var merge_1 = merge$1;
function mergeWith() {
  var otherSources = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    otherSources[_i] = arguments[_i];
  }
  return merge_1.merge.apply(void 0, __spreadArray$6([], __read$6(otherSources)));
}
mergeWith$1.mergeWith = mergeWith;
var min$1 = {};
Object.defineProperty(min$1, "__esModule", { value: true });
min$1.min = void 0;
var reduce_1 = reduce$1;
var isFunction_1$4 = isFunction$1;
function min(comparer) {
  return reduce_1.reduce(isFunction_1$4.isFunction(comparer) ? function(x2, y2) {
    return comparer(x2, y2) < 0 ? x2 : y2;
  } : function(x2, y2) {
    return x2 < y2 ? x2 : y2;
  });
}
min$1.min = min;
var multicast$1 = {};
Object.defineProperty(multicast$1, "__esModule", { value: true });
multicast$1.multicast = void 0;
var ConnectableObservable_1$2 = ConnectableObservable$1;
var isFunction_1$3 = isFunction$1;
var connect_1$1 = connect$1;
function multicast(subjectOrSubjectFactory, selector) {
  var subjectFactory = isFunction_1$3.isFunction(subjectOrSubjectFactory) ? subjectOrSubjectFactory : function() {
    return subjectOrSubjectFactory;
  };
  if (isFunction_1$3.isFunction(selector)) {
    return connect_1$1.connect(selector, {
      connector: subjectFactory
    });
  }
  return function(source) {
    return new ConnectableObservable_1$2.ConnectableObservable(source, subjectFactory);
  };
}
multicast$1.multicast = multicast;
var onErrorResumeNextWith$1 = {};
var __read$5 = commonjsGlobal && commonjsGlobal.__read || function(o, n2) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
    while ((n2 === void 0 || n2-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar;
};
var __spreadArray$5 = commonjsGlobal && commonjsGlobal.__spreadArray || function(to, from2) {
  for (var i = 0, il = from2.length, j2 = to.length; i < il; i++, j2++)
    to[j2] = from2[i];
  return to;
};
Object.defineProperty(onErrorResumeNextWith$1, "__esModule", { value: true });
onErrorResumeNextWith$1.onErrorResumeNext = onErrorResumeNextWith$1.onErrorResumeNextWith = void 0;
var argsOrArgArray_1 = argsOrArgArray$1;
var onErrorResumeNext_1 = onErrorResumeNext$1;
function onErrorResumeNextWith() {
  var sources = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    sources[_i] = arguments[_i];
  }
  var nextSources = argsOrArgArray_1.argsOrArgArray(sources);
  return function(source) {
    return onErrorResumeNext_1.onErrorResumeNext.apply(void 0, __spreadArray$5([source], __read$5(nextSources)));
  };
}
onErrorResumeNextWith$1.onErrorResumeNextWith = onErrorResumeNextWith;
onErrorResumeNextWith$1.onErrorResumeNext = onErrorResumeNextWith;
var pairwise$1 = {};
Object.defineProperty(pairwise$1, "__esModule", { value: true });
pairwise$1.pairwise = void 0;
var lift_1$s = lift;
var OperatorSubscriber_1$m = OperatorSubscriber$1;
function pairwise() {
  return lift_1$s.operate(function(source, subscriber) {
    var prev;
    var hasPrev = false;
    source.subscribe(OperatorSubscriber_1$m.createOperatorSubscriber(subscriber, function(value) {
      var p = prev;
      prev = value;
      hasPrev && subscriber.next([p, value]);
      hasPrev = true;
    }));
  });
}
pairwise$1.pairwise = pairwise;
var pluck$1 = {};
Object.defineProperty(pluck$1, "__esModule", { value: true });
pluck$1.pluck = void 0;
var map_1$1 = map$1;
function pluck() {
  var properties = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    properties[_i] = arguments[_i];
  }
  var length = properties.length;
  if (length === 0) {
    throw new Error("list of properties cannot be empty.");
  }
  return map_1$1.map(function(x2) {
    var currentProp = x2;
    for (var i = 0; i < length; i++) {
      var p = currentProp === null || currentProp === void 0 ? void 0 : currentProp[properties[i]];
      if (typeof p !== "undefined") {
        currentProp = p;
      } else {
        return void 0;
      }
    }
    return currentProp;
  });
}
pluck$1.pluck = pluck;
var publish$1 = {};
Object.defineProperty(publish$1, "__esModule", { value: true });
publish$1.publish = void 0;
var Subject_1$8 = Subject$1;
var multicast_1$1 = multicast$1;
var connect_1 = connect$1;
function publish(selector) {
  return selector ? function(source) {
    return connect_1.connect(selector)(source);
  } : function(source) {
    return multicast_1$1.multicast(new Subject_1$8.Subject())(source);
  };
}
publish$1.publish = publish;
var publishBehavior$1 = {};
Object.defineProperty(publishBehavior$1, "__esModule", { value: true });
publishBehavior$1.publishBehavior = void 0;
var BehaviorSubject_1 = BehaviorSubject$1;
var ConnectableObservable_1$1 = ConnectableObservable$1;
function publishBehavior(initialValue) {
  return function(source) {
    var subject = new BehaviorSubject_1.BehaviorSubject(initialValue);
    return new ConnectableObservable_1$1.ConnectableObservable(source, function() {
      return subject;
    });
  };
}
publishBehavior$1.publishBehavior = publishBehavior;
var publishLast$1 = {};
Object.defineProperty(publishLast$1, "__esModule", { value: true });
publishLast$1.publishLast = void 0;
var AsyncSubject_1 = AsyncSubject$1;
var ConnectableObservable_1 = ConnectableObservable$1;
function publishLast() {
  return function(source) {
    var subject = new AsyncSubject_1.AsyncSubject();
    return new ConnectableObservable_1.ConnectableObservable(source, function() {
      return subject;
    });
  };
}
publishLast$1.publishLast = publishLast;
var publishReplay$1 = {};
Object.defineProperty(publishReplay$1, "__esModule", { value: true });
publishReplay$1.publishReplay = void 0;
var ReplaySubject_1$1 = ReplaySubject$1;
var multicast_1 = multicast$1;
var isFunction_1$2 = isFunction$1;
function publishReplay(bufferSize, windowTime2, selectorOrScheduler, timestampProvider) {
  if (selectorOrScheduler && !isFunction_1$2.isFunction(selectorOrScheduler)) {
    timestampProvider = selectorOrScheduler;
  }
  var selector = isFunction_1$2.isFunction(selectorOrScheduler) ? selectorOrScheduler : void 0;
  return function(source) {
    return multicast_1.multicast(new ReplaySubject_1$1.ReplaySubject(bufferSize, windowTime2, timestampProvider), selector)(source);
  };
}
publishReplay$1.publishReplay = publishReplay;
var raceWith$1 = {};
var __read$4 = commonjsGlobal && commonjsGlobal.__read || function(o, n2) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
    while ((n2 === void 0 || n2-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar;
};
var __spreadArray$4 = commonjsGlobal && commonjsGlobal.__spreadArray || function(to, from2) {
  for (var i = 0, il = from2.length, j2 = to.length; i < il; i++, j2++)
    to[j2] = from2[i];
  return to;
};
Object.defineProperty(raceWith$1, "__esModule", { value: true });
raceWith$1.raceWith = void 0;
var race_1 = race$1;
var lift_1$r = lift;
var identity_1$5 = identity$1;
function raceWith() {
  var otherSources = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    otherSources[_i] = arguments[_i];
  }
  return !otherSources.length ? identity_1$5.identity : lift_1$r.operate(function(source, subscriber) {
    race_1.raceInit(__spreadArray$4([source], __read$4(otherSources)))(subscriber);
  });
}
raceWith$1.raceWith = raceWith;
var repeat$1 = {};
Object.defineProperty(repeat$1, "__esModule", { value: true });
repeat$1.repeat = void 0;
var empty_1 = empty;
var lift_1$q = lift;
var OperatorSubscriber_1$l = OperatorSubscriber$1;
var innerFrom_1$e = innerFrom$1;
var timer_1$2 = timer$1;
function repeat(countOrConfig) {
  var _a;
  var count2 = Infinity;
  var delay2;
  if (countOrConfig != null) {
    if (typeof countOrConfig === "object") {
      _a = countOrConfig.count, count2 = _a === void 0 ? Infinity : _a, delay2 = countOrConfig.delay;
    } else {
      count2 = countOrConfig;
    }
  }
  return count2 <= 0 ? function() {
    return empty_1.EMPTY;
  } : lift_1$q.operate(function(source, subscriber) {
    var soFar = 0;
    var sourceSub;
    var resubscribe = function() {
      sourceSub === null || sourceSub === void 0 ? void 0 : sourceSub.unsubscribe();
      sourceSub = null;
      if (delay2 != null) {
        var notifier = typeof delay2 === "number" ? timer_1$2.timer(delay2) : innerFrom_1$e.innerFrom(delay2(soFar));
        var notifierSubscriber_1 = OperatorSubscriber_1$l.createOperatorSubscriber(subscriber, function() {
          notifierSubscriber_1.unsubscribe();
          subscribeToSource();
        });
        notifier.subscribe(notifierSubscriber_1);
      } else {
        subscribeToSource();
      }
    };
    var subscribeToSource = function() {
      var syncUnsub = false;
      sourceSub = source.subscribe(OperatorSubscriber_1$l.createOperatorSubscriber(subscriber, void 0, function() {
        if (++soFar < count2) {
          if (sourceSub) {
            resubscribe();
          } else {
            syncUnsub = true;
          }
        } else {
          subscriber.complete();
        }
      }));
      if (syncUnsub) {
        resubscribe();
      }
    };
    subscribeToSource();
  });
}
repeat$1.repeat = repeat;
var repeatWhen$1 = {};
Object.defineProperty(repeatWhen$1, "__esModule", { value: true });
repeatWhen$1.repeatWhen = void 0;
var innerFrom_1$d = innerFrom$1;
var Subject_1$7 = Subject$1;
var lift_1$p = lift;
var OperatorSubscriber_1$k = OperatorSubscriber$1;
function repeatWhen(notifier) {
  return lift_1$p.operate(function(source, subscriber) {
    var innerSub;
    var syncResub = false;
    var completions$;
    var isNotifierComplete = false;
    var isMainComplete = false;
    var checkComplete = function() {
      return isMainComplete && isNotifierComplete && (subscriber.complete(), true);
    };
    var getCompletionSubject = function() {
      if (!completions$) {
        completions$ = new Subject_1$7.Subject();
        innerFrom_1$d.innerFrom(notifier(completions$)).subscribe(OperatorSubscriber_1$k.createOperatorSubscriber(subscriber, function() {
          if (innerSub) {
            subscribeForRepeatWhen();
          } else {
            syncResub = true;
          }
        }, function() {
          isNotifierComplete = true;
          checkComplete();
        }));
      }
      return completions$;
    };
    var subscribeForRepeatWhen = function() {
      isMainComplete = false;
      innerSub = source.subscribe(OperatorSubscriber_1$k.createOperatorSubscriber(subscriber, void 0, function() {
        isMainComplete = true;
        !checkComplete() && getCompletionSubject().next();
      }));
      if (syncResub) {
        innerSub.unsubscribe();
        innerSub = null;
        syncResub = false;
        subscribeForRepeatWhen();
      }
    };
    subscribeForRepeatWhen();
  });
}
repeatWhen$1.repeatWhen = repeatWhen;
var retry$1 = {};
Object.defineProperty(retry$1, "__esModule", { value: true });
retry$1.retry = void 0;
var lift_1$o = lift;
var OperatorSubscriber_1$j = OperatorSubscriber$1;
var identity_1$4 = identity$1;
var timer_1$1 = timer$1;
var innerFrom_1$c = innerFrom$1;
function retry(configOrCount) {
  if (configOrCount === void 0) {
    configOrCount = Infinity;
  }
  var config2;
  if (configOrCount && typeof configOrCount === "object") {
    config2 = configOrCount;
  } else {
    config2 = {
      count: configOrCount
    };
  }
  var _a = config2.count, count2 = _a === void 0 ? Infinity : _a, delay2 = config2.delay, _b = config2.resetOnSuccess, resetOnSuccess = _b === void 0 ? false : _b;
  return count2 <= 0 ? identity_1$4.identity : lift_1$o.operate(function(source, subscriber) {
    var soFar = 0;
    var innerSub;
    var subscribeForRetry = function() {
      var syncUnsub = false;
      innerSub = source.subscribe(OperatorSubscriber_1$j.createOperatorSubscriber(subscriber, function(value) {
        if (resetOnSuccess) {
          soFar = 0;
        }
        subscriber.next(value);
      }, void 0, function(err) {
        if (soFar++ < count2) {
          var resub_1 = function() {
            if (innerSub) {
              innerSub.unsubscribe();
              innerSub = null;
              subscribeForRetry();
            } else {
              syncUnsub = true;
            }
          };
          if (delay2 != null) {
            var notifier = typeof delay2 === "number" ? timer_1$1.timer(delay2) : innerFrom_1$c.innerFrom(delay2(err, soFar));
            var notifierSubscriber_1 = OperatorSubscriber_1$j.createOperatorSubscriber(subscriber, function() {
              notifierSubscriber_1.unsubscribe();
              resub_1();
            }, function() {
              subscriber.complete();
            });
            notifier.subscribe(notifierSubscriber_1);
          } else {
            resub_1();
          }
        } else {
          subscriber.error(err);
        }
      }));
      if (syncUnsub) {
        innerSub.unsubscribe();
        innerSub = null;
        subscribeForRetry();
      }
    };
    subscribeForRetry();
  });
}
retry$1.retry = retry;
var retryWhen$1 = {};
Object.defineProperty(retryWhen$1, "__esModule", { value: true });
retryWhen$1.retryWhen = void 0;
var innerFrom_1$b = innerFrom$1;
var Subject_1$6 = Subject$1;
var lift_1$n = lift;
var OperatorSubscriber_1$i = OperatorSubscriber$1;
function retryWhen(notifier) {
  return lift_1$n.operate(function(source, subscriber) {
    var innerSub;
    var syncResub = false;
    var errors$;
    var subscribeForRetryWhen = function() {
      innerSub = source.subscribe(OperatorSubscriber_1$i.createOperatorSubscriber(subscriber, void 0, void 0, function(err) {
        if (!errors$) {
          errors$ = new Subject_1$6.Subject();
          innerFrom_1$b.innerFrom(notifier(errors$)).subscribe(OperatorSubscriber_1$i.createOperatorSubscriber(subscriber, function() {
            return innerSub ? subscribeForRetryWhen() : syncResub = true;
          }));
        }
        if (errors$) {
          errors$.next(err);
        }
      }));
      if (syncResub) {
        innerSub.unsubscribe();
        innerSub = null;
        syncResub = false;
        subscribeForRetryWhen();
      }
    };
    subscribeForRetryWhen();
  });
}
retryWhen$1.retryWhen = retryWhen;
var sample$1 = {};
Object.defineProperty(sample$1, "__esModule", { value: true });
sample$1.sample = void 0;
var innerFrom_1$a = innerFrom$1;
var lift_1$m = lift;
var noop_1$5 = noop$1;
var OperatorSubscriber_1$h = OperatorSubscriber$1;
function sample(notifier) {
  return lift_1$m.operate(function(source, subscriber) {
    var hasValue = false;
    var lastValue = null;
    source.subscribe(OperatorSubscriber_1$h.createOperatorSubscriber(subscriber, function(value) {
      hasValue = true;
      lastValue = value;
    }));
    innerFrom_1$a.innerFrom(notifier).subscribe(OperatorSubscriber_1$h.createOperatorSubscriber(subscriber, function() {
      if (hasValue) {
        hasValue = false;
        var value = lastValue;
        lastValue = null;
        subscriber.next(value);
      }
    }, noop_1$5.noop));
  });
}
sample$1.sample = sample;
var sampleTime$1 = {};
Object.defineProperty(sampleTime$1, "__esModule", { value: true });
sampleTime$1.sampleTime = void 0;
var async_1$4 = async;
var sample_1 = sample$1;
var interval_1 = interval$1;
function sampleTime(period, scheduler) {
  if (scheduler === void 0) {
    scheduler = async_1$4.asyncScheduler;
  }
  return sample_1.sample(interval_1.interval(period, scheduler));
}
sampleTime$1.sampleTime = sampleTime;
var scan$1 = {};
Object.defineProperty(scan$1, "__esModule", { value: true });
scan$1.scan = void 0;
var lift_1$l = lift;
var scanInternals_1 = scanInternals$1;
function scan(accumulator, seed) {
  return lift_1$l.operate(scanInternals_1.scanInternals(accumulator, seed, arguments.length >= 2, true));
}
scan$1.scan = scan;
var sequenceEqual$1 = {};
Object.defineProperty(sequenceEqual$1, "__esModule", { value: true });
sequenceEqual$1.sequenceEqual = void 0;
var lift_1$k = lift;
var OperatorSubscriber_1$g = OperatorSubscriber$1;
var innerFrom_1$9 = innerFrom$1;
function sequenceEqual(compareTo, comparator) {
  if (comparator === void 0) {
    comparator = function(a, b) {
      return a === b;
    };
  }
  return lift_1$k.operate(function(source, subscriber) {
    var aState = createState();
    var bState = createState();
    var emit2 = function(isEqual) {
      subscriber.next(isEqual);
      subscriber.complete();
    };
    var createSubscriber = function(selfState, otherState) {
      var sequenceEqualSubscriber = OperatorSubscriber_1$g.createOperatorSubscriber(subscriber, function(a) {
        var buffer2 = otherState.buffer, complete = otherState.complete;
        if (buffer2.length === 0) {
          complete ? emit2(false) : selfState.buffer.push(a);
        } else {
          !comparator(a, buffer2.shift()) && emit2(false);
        }
      }, function() {
        selfState.complete = true;
        var complete = otherState.complete, buffer2 = otherState.buffer;
        complete && emit2(buffer2.length === 0);
        sequenceEqualSubscriber === null || sequenceEqualSubscriber === void 0 ? void 0 : sequenceEqualSubscriber.unsubscribe();
      });
      return sequenceEqualSubscriber;
    };
    source.subscribe(createSubscriber(aState, bState));
    innerFrom_1$9.innerFrom(compareTo).subscribe(createSubscriber(bState, aState));
  });
}
sequenceEqual$1.sequenceEqual = sequenceEqual;
function createState() {
  return {
    buffer: [],
    complete: false
  };
}
var share$1 = {};
var __read$3 = commonjsGlobal && commonjsGlobal.__read || function(o, n2) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
    while ((n2 === void 0 || n2-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar;
};
var __spreadArray$3 = commonjsGlobal && commonjsGlobal.__spreadArray || function(to, from2) {
  for (var i = 0, il = from2.length, j2 = to.length; i < il; i++, j2++)
    to[j2] = from2[i];
  return to;
};
Object.defineProperty(share$1, "__esModule", { value: true });
share$1.share = void 0;
var innerFrom_1$8 = innerFrom$1;
var Subject_1$5 = Subject$1;
var Subscriber_1 = Subscriber;
var lift_1$j = lift;
function share(options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.connector, connector = _a === void 0 ? function() {
    return new Subject_1$5.Subject();
  } : _a, _b = options.resetOnError, resetOnError = _b === void 0 ? true : _b, _c = options.resetOnComplete, resetOnComplete = _c === void 0 ? true : _c, _d = options.resetOnRefCountZero, resetOnRefCountZero = _d === void 0 ? true : _d;
  return function(wrapperSource) {
    var connection;
    var resetConnection;
    var subject;
    var refCount2 = 0;
    var hasCompleted = false;
    var hasErrored = false;
    var cancelReset = function() {
      resetConnection === null || resetConnection === void 0 ? void 0 : resetConnection.unsubscribe();
      resetConnection = void 0;
    };
    var reset = function() {
      cancelReset();
      connection = subject = void 0;
      hasCompleted = hasErrored = false;
    };
    var resetAndUnsubscribe = function() {
      var conn = connection;
      reset();
      conn === null || conn === void 0 ? void 0 : conn.unsubscribe();
    };
    return lift_1$j.operate(function(source, subscriber) {
      refCount2++;
      if (!hasErrored && !hasCompleted) {
        cancelReset();
      }
      var dest = subject = subject !== null && subject !== void 0 ? subject : connector();
      subscriber.add(function() {
        refCount2--;
        if (refCount2 === 0 && !hasErrored && !hasCompleted) {
          resetConnection = handleReset(resetAndUnsubscribe, resetOnRefCountZero);
        }
      });
      dest.subscribe(subscriber);
      if (!connection && refCount2 > 0) {
        connection = new Subscriber_1.SafeSubscriber({
          next: function(value) {
            return dest.next(value);
          },
          error: function(err) {
            hasErrored = true;
            cancelReset();
            resetConnection = handleReset(reset, resetOnError, err);
            dest.error(err);
          },
          complete: function() {
            hasCompleted = true;
            cancelReset();
            resetConnection = handleReset(reset, resetOnComplete);
            dest.complete();
          }
        });
        innerFrom_1$8.innerFrom(source).subscribe(connection);
      }
    })(wrapperSource);
  };
}
share$1.share = share;
function handleReset(reset, on) {
  var args2 = [];
  for (var _i = 2; _i < arguments.length; _i++) {
    args2[_i - 2] = arguments[_i];
  }
  if (on === true) {
    reset();
    return;
  }
  if (on === false) {
    return;
  }
  var onSubscriber = new Subscriber_1.SafeSubscriber({
    next: function() {
      onSubscriber.unsubscribe();
      reset();
    }
  });
  return innerFrom_1$8.innerFrom(on.apply(void 0, __spreadArray$3([], __read$3(args2)))).subscribe(onSubscriber);
}
var shareReplay$1 = {};
Object.defineProperty(shareReplay$1, "__esModule", { value: true });
shareReplay$1.shareReplay = void 0;
var ReplaySubject_1 = ReplaySubject$1;
var share_1 = share$1;
function shareReplay(configOrBufferSize, windowTime2, scheduler) {
  var _a, _b, _c;
  var bufferSize;
  var refCount2 = false;
  if (configOrBufferSize && typeof configOrBufferSize === "object") {
    _a = configOrBufferSize.bufferSize, bufferSize = _a === void 0 ? Infinity : _a, _b = configOrBufferSize.windowTime, windowTime2 = _b === void 0 ? Infinity : _b, _c = configOrBufferSize.refCount, refCount2 = _c === void 0 ? false : _c, scheduler = configOrBufferSize.scheduler;
  } else {
    bufferSize = configOrBufferSize !== null && configOrBufferSize !== void 0 ? configOrBufferSize : Infinity;
  }
  return share_1.share({
    connector: function() {
      return new ReplaySubject_1.ReplaySubject(bufferSize, windowTime2, scheduler);
    },
    resetOnError: true,
    resetOnComplete: false,
    resetOnRefCountZero: refCount2
  });
}
shareReplay$1.shareReplay = shareReplay;
var single$1 = {};
Object.defineProperty(single$1, "__esModule", { value: true });
single$1.single = void 0;
var EmptyError_1 = EmptyError;
var SequenceError_1 = SequenceError;
var NotFoundError_1 = NotFoundError;
var lift_1$i = lift;
var OperatorSubscriber_1$f = OperatorSubscriber$1;
function single(predicate) {
  return lift_1$i.operate(function(source, subscriber) {
    var hasValue = false;
    var singleValue;
    var seenValue = false;
    var index = 0;
    source.subscribe(OperatorSubscriber_1$f.createOperatorSubscriber(subscriber, function(value) {
      seenValue = true;
      if (!predicate || predicate(value, index++, source)) {
        hasValue && subscriber.error(new SequenceError_1.SequenceError("Too many matching values"));
        hasValue = true;
        singleValue = value;
      }
    }, function() {
      if (hasValue) {
        subscriber.next(singleValue);
        subscriber.complete();
      } else {
        subscriber.error(seenValue ? new NotFoundError_1.NotFoundError("No matching values") : new EmptyError_1.EmptyError());
      }
    }));
  });
}
single$1.single = single;
var skip$1 = {};
Object.defineProperty(skip$1, "__esModule", { value: true });
skip$1.skip = void 0;
var filter_1 = filter$1;
function skip(count2) {
  return filter_1.filter(function(_, index) {
    return count2 <= index;
  });
}
skip$1.skip = skip;
var skipLast$1 = {};
Object.defineProperty(skipLast$1, "__esModule", { value: true });
skipLast$1.skipLast = void 0;
var identity_1$3 = identity$1;
var lift_1$h = lift;
var OperatorSubscriber_1$e = OperatorSubscriber$1;
function skipLast(skipCount) {
  return skipCount <= 0 ? identity_1$3.identity : lift_1$h.operate(function(source, subscriber) {
    var ring = new Array(skipCount);
    var seen = 0;
    source.subscribe(OperatorSubscriber_1$e.createOperatorSubscriber(subscriber, function(value) {
      var valueIndex = seen++;
      if (valueIndex < skipCount) {
        ring[valueIndex] = value;
      } else {
        var index = valueIndex % skipCount;
        var oldValue = ring[index];
        ring[index] = value;
        subscriber.next(oldValue);
      }
    }));
    return function() {
      ring = null;
    };
  });
}
skipLast$1.skipLast = skipLast;
var skipUntil$1 = {};
Object.defineProperty(skipUntil$1, "__esModule", { value: true });
skipUntil$1.skipUntil = void 0;
var lift_1$g = lift;
var OperatorSubscriber_1$d = OperatorSubscriber$1;
var innerFrom_1$7 = innerFrom$1;
var noop_1$4 = noop$1;
function skipUntil(notifier) {
  return lift_1$g.operate(function(source, subscriber) {
    var taking = false;
    var skipSubscriber = OperatorSubscriber_1$d.createOperatorSubscriber(subscriber, function() {
      skipSubscriber === null || skipSubscriber === void 0 ? void 0 : skipSubscriber.unsubscribe();
      taking = true;
    }, noop_1$4.noop);
    innerFrom_1$7.innerFrom(notifier).subscribe(skipSubscriber);
    source.subscribe(OperatorSubscriber_1$d.createOperatorSubscriber(subscriber, function(value) {
      return taking && subscriber.next(value);
    }));
  });
}
skipUntil$1.skipUntil = skipUntil;
var skipWhile$1 = {};
Object.defineProperty(skipWhile$1, "__esModule", { value: true });
skipWhile$1.skipWhile = void 0;
var lift_1$f = lift;
var OperatorSubscriber_1$c = OperatorSubscriber$1;
function skipWhile(predicate) {
  return lift_1$f.operate(function(source, subscriber) {
    var taking = false;
    var index = 0;
    source.subscribe(OperatorSubscriber_1$c.createOperatorSubscriber(subscriber, function(value) {
      return (taking || (taking = !predicate(value, index++))) && subscriber.next(value);
    }));
  });
}
skipWhile$1.skipWhile = skipWhile;
var startWith$1 = {};
Object.defineProperty(startWith$1, "__esModule", { value: true });
startWith$1.startWith = void 0;
var concat_1 = concat$3;
var args_1$2 = args;
var lift_1$e = lift;
function startWith() {
  var values = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    values[_i] = arguments[_i];
  }
  var scheduler = args_1$2.popScheduler(values);
  return lift_1$e.operate(function(source, subscriber) {
    (scheduler ? concat_1.concat(values, source, scheduler) : concat_1.concat(values, source)).subscribe(subscriber);
  });
}
startWith$1.startWith = startWith;
var switchAll$1 = {};
var switchMap$1 = {};
Object.defineProperty(switchMap$1, "__esModule", { value: true });
switchMap$1.switchMap = void 0;
var innerFrom_1$6 = innerFrom$1;
var lift_1$d = lift;
var OperatorSubscriber_1$b = OperatorSubscriber$1;
function switchMap(project, resultSelector) {
  return lift_1$d.operate(function(source, subscriber) {
    var innerSubscriber = null;
    var index = 0;
    var isComplete = false;
    var checkComplete = function() {
      return isComplete && !innerSubscriber && subscriber.complete();
    };
    source.subscribe(OperatorSubscriber_1$b.createOperatorSubscriber(subscriber, function(value) {
      innerSubscriber === null || innerSubscriber === void 0 ? void 0 : innerSubscriber.unsubscribe();
      var innerIndex = 0;
      var outerIndex = index++;
      innerFrom_1$6.innerFrom(project(value, outerIndex)).subscribe(innerSubscriber = OperatorSubscriber_1$b.createOperatorSubscriber(subscriber, function(innerValue) {
        return subscriber.next(resultSelector ? resultSelector(value, innerValue, outerIndex, innerIndex++) : innerValue);
      }, function() {
        innerSubscriber = null;
        checkComplete();
      }));
    }, function() {
      isComplete = true;
      checkComplete();
    }));
  });
}
switchMap$1.switchMap = switchMap;
Object.defineProperty(switchAll$1, "__esModule", { value: true });
switchAll$1.switchAll = void 0;
var switchMap_1$2 = switchMap$1;
var identity_1$2 = identity$1;
function switchAll() {
  return switchMap_1$2.switchMap(identity_1$2.identity);
}
switchAll$1.switchAll = switchAll;
var switchMapTo$1 = {};
Object.defineProperty(switchMapTo$1, "__esModule", { value: true });
switchMapTo$1.switchMapTo = void 0;
var switchMap_1$1 = switchMap$1;
var isFunction_1$1 = isFunction$1;
function switchMapTo(innerObservable, resultSelector) {
  return isFunction_1$1.isFunction(resultSelector) ? switchMap_1$1.switchMap(function() {
    return innerObservable;
  }, resultSelector) : switchMap_1$1.switchMap(function() {
    return innerObservable;
  });
}
switchMapTo$1.switchMapTo = switchMapTo;
var switchScan$1 = {};
Object.defineProperty(switchScan$1, "__esModule", { value: true });
switchScan$1.switchScan = void 0;
var switchMap_1 = switchMap$1;
var lift_1$c = lift;
function switchScan(accumulator, seed) {
  return lift_1$c.operate(function(source, subscriber) {
    var state = seed;
    switchMap_1.switchMap(function(value, index) {
      return accumulator(state, value, index);
    }, function(_, innerValue) {
      return state = innerValue, innerValue;
    })(source).subscribe(subscriber);
    return function() {
      state = null;
    };
  });
}
switchScan$1.switchScan = switchScan;
var takeUntil$1 = {};
Object.defineProperty(takeUntil$1, "__esModule", { value: true });
takeUntil$1.takeUntil = void 0;
var lift_1$b = lift;
var OperatorSubscriber_1$a = OperatorSubscriber$1;
var innerFrom_1$5 = innerFrom$1;
var noop_1$3 = noop$1;
function takeUntil(notifier) {
  return lift_1$b.operate(function(source, subscriber) {
    innerFrom_1$5.innerFrom(notifier).subscribe(OperatorSubscriber_1$a.createOperatorSubscriber(subscriber, function() {
      return subscriber.complete();
    }, noop_1$3.noop));
    !subscriber.closed && source.subscribe(subscriber);
  });
}
takeUntil$1.takeUntil = takeUntil;
var takeWhile$1 = {};
Object.defineProperty(takeWhile$1, "__esModule", { value: true });
takeWhile$1.takeWhile = void 0;
var lift_1$a = lift;
var OperatorSubscriber_1$9 = OperatorSubscriber$1;
function takeWhile(predicate, inclusive) {
  if (inclusive === void 0) {
    inclusive = false;
  }
  return lift_1$a.operate(function(source, subscriber) {
    var index = 0;
    source.subscribe(OperatorSubscriber_1$9.createOperatorSubscriber(subscriber, function(value) {
      var result = predicate(value, index++);
      (result || inclusive) && subscriber.next(value);
      !result && subscriber.complete();
    }));
  });
}
takeWhile$1.takeWhile = takeWhile;
var tap$1 = {};
Object.defineProperty(tap$1, "__esModule", { value: true });
tap$1.tap = void 0;
var isFunction_1 = isFunction$1;
var lift_1$9 = lift;
var OperatorSubscriber_1$8 = OperatorSubscriber$1;
var identity_1$1 = identity$1;
function tap(observerOrNext, error, complete) {
  var tapObserver = isFunction_1.isFunction(observerOrNext) || error || complete ? { next: observerOrNext, error, complete } : observerOrNext;
  return tapObserver ? lift_1$9.operate(function(source, subscriber) {
    var _a;
    (_a = tapObserver.subscribe) === null || _a === void 0 ? void 0 : _a.call(tapObserver);
    var isUnsub = true;
    source.subscribe(OperatorSubscriber_1$8.createOperatorSubscriber(subscriber, function(value) {
      var _a2;
      (_a2 = tapObserver.next) === null || _a2 === void 0 ? void 0 : _a2.call(tapObserver, value);
      subscriber.next(value);
    }, function() {
      var _a2;
      isUnsub = false;
      (_a2 = tapObserver.complete) === null || _a2 === void 0 ? void 0 : _a2.call(tapObserver);
      subscriber.complete();
    }, function(err) {
      var _a2;
      isUnsub = false;
      (_a2 = tapObserver.error) === null || _a2 === void 0 ? void 0 : _a2.call(tapObserver, err);
      subscriber.error(err);
    }, function() {
      var _a2, _b;
      if (isUnsub) {
        (_a2 = tapObserver.unsubscribe) === null || _a2 === void 0 ? void 0 : _a2.call(tapObserver);
      }
      (_b = tapObserver.finalize) === null || _b === void 0 ? void 0 : _b.call(tapObserver);
    }));
  }) : identity_1$1.identity;
}
tap$1.tap = tap;
var throttle$1 = {};
Object.defineProperty(throttle$1, "__esModule", { value: true });
throttle$1.throttle = void 0;
var lift_1$8 = lift;
var OperatorSubscriber_1$7 = OperatorSubscriber$1;
var innerFrom_1$4 = innerFrom$1;
function throttle(durationSelector, config2) {
  return lift_1$8.operate(function(source, subscriber) {
    var _a = config2 !== null && config2 !== void 0 ? config2 : {}, _b = _a.leading, leading = _b === void 0 ? true : _b, _c = _a.trailing, trailing = _c === void 0 ? false : _c;
    var hasValue = false;
    var sendValue = null;
    var throttled = null;
    var isComplete = false;
    var endThrottling = function() {
      throttled === null || throttled === void 0 ? void 0 : throttled.unsubscribe();
      throttled = null;
      if (trailing) {
        send();
        isComplete && subscriber.complete();
      }
    };
    var cleanupThrottling = function() {
      throttled = null;
      isComplete && subscriber.complete();
    };
    var startThrottle = function(value) {
      return throttled = innerFrom_1$4.innerFrom(durationSelector(value)).subscribe(OperatorSubscriber_1$7.createOperatorSubscriber(subscriber, endThrottling, cleanupThrottling));
    };
    var send = function() {
      if (hasValue) {
        hasValue = false;
        var value = sendValue;
        sendValue = null;
        subscriber.next(value);
        !isComplete && startThrottle(value);
      }
    };
    source.subscribe(OperatorSubscriber_1$7.createOperatorSubscriber(subscriber, function(value) {
      hasValue = true;
      sendValue = value;
      !(throttled && !throttled.closed) && (leading ? send() : startThrottle(value));
    }, function() {
      isComplete = true;
      !(trailing && hasValue && throttled && !throttled.closed) && subscriber.complete();
    }));
  });
}
throttle$1.throttle = throttle;
var throttleTime$1 = {};
Object.defineProperty(throttleTime$1, "__esModule", { value: true });
throttleTime$1.throttleTime = void 0;
var async_1$3 = async;
var throttle_1 = throttle$1;
var timer_1 = timer$1;
function throttleTime(duration, scheduler, config2) {
  if (scheduler === void 0) {
    scheduler = async_1$3.asyncScheduler;
  }
  var duration$ = timer_1.timer(duration, scheduler);
  return throttle_1.throttle(function() {
    return duration$;
  }, config2);
}
throttleTime$1.throttleTime = throttleTime;
var timeInterval$1 = {};
Object.defineProperty(timeInterval$1, "__esModule", { value: true });
timeInterval$1.TimeInterval = timeInterval$1.timeInterval = void 0;
var async_1$2 = async;
var lift_1$7 = lift;
var OperatorSubscriber_1$6 = OperatorSubscriber$1;
function timeInterval(scheduler) {
  if (scheduler === void 0) {
    scheduler = async_1$2.asyncScheduler;
  }
  return lift_1$7.operate(function(source, subscriber) {
    var last2 = scheduler.now();
    source.subscribe(OperatorSubscriber_1$6.createOperatorSubscriber(subscriber, function(value) {
      var now = scheduler.now();
      var interval2 = now - last2;
      last2 = now;
      subscriber.next(new TimeInterval(value, interval2));
    }));
  });
}
timeInterval$1.timeInterval = timeInterval;
var TimeInterval = /* @__PURE__ */ function() {
  function TimeInterval2(value, interval2) {
    this.value = value;
    this.interval = interval2;
  }
  return TimeInterval2;
}();
timeInterval$1.TimeInterval = TimeInterval;
var timeoutWith$1 = {};
Object.defineProperty(timeoutWith$1, "__esModule", { value: true });
timeoutWith$1.timeoutWith = void 0;
var async_1$1 = async;
var isDate_1 = isDate;
var timeout_1 = timeout;
function timeoutWith(due, withObservable, scheduler) {
  var first2;
  var each;
  var _with;
  scheduler = scheduler !== null && scheduler !== void 0 ? scheduler : async_1$1.async;
  if (isDate_1.isValidDate(due)) {
    first2 = due;
  } else if (typeof due === "number") {
    each = due;
  }
  if (withObservable) {
    _with = function() {
      return withObservable;
    };
  } else {
    throw new TypeError("No observable provided to switch to");
  }
  if (first2 == null && each == null) {
    throw new TypeError("No timeout provided.");
  }
  return timeout_1.timeout({
    first: first2,
    each,
    scheduler,
    with: _with
  });
}
timeoutWith$1.timeoutWith = timeoutWith;
var timestamp$1 = {};
Object.defineProperty(timestamp$1, "__esModule", { value: true });
timestamp$1.timestamp = void 0;
var dateTimestampProvider_1 = dateTimestampProvider;
var map_1 = map$1;
function timestamp(timestampProvider) {
  if (timestampProvider === void 0) {
    timestampProvider = dateTimestampProvider_1.dateTimestampProvider;
  }
  return map_1.map(function(value) {
    return { value, timestamp: timestampProvider.now() };
  });
}
timestamp$1.timestamp = timestamp;
var window$2 = {};
Object.defineProperty(window$2, "__esModule", { value: true });
window$2.window = void 0;
var Subject_1$4 = Subject$1;
var lift_1$6 = lift;
var OperatorSubscriber_1$5 = OperatorSubscriber$1;
var noop_1$2 = noop$1;
var innerFrom_1$3 = innerFrom$1;
function window$1(windowBoundaries) {
  return lift_1$6.operate(function(source, subscriber) {
    var windowSubject = new Subject_1$4.Subject();
    subscriber.next(windowSubject.asObservable());
    var errorHandler = function(err) {
      windowSubject.error(err);
      subscriber.error(err);
    };
    source.subscribe(OperatorSubscriber_1$5.createOperatorSubscriber(subscriber, function(value) {
      return windowSubject === null || windowSubject === void 0 ? void 0 : windowSubject.next(value);
    }, function() {
      windowSubject.complete();
      subscriber.complete();
    }, errorHandler));
    innerFrom_1$3.innerFrom(windowBoundaries).subscribe(OperatorSubscriber_1$5.createOperatorSubscriber(subscriber, function() {
      windowSubject.complete();
      subscriber.next(windowSubject = new Subject_1$4.Subject());
    }, noop_1$2.noop, errorHandler));
    return function() {
      windowSubject === null || windowSubject === void 0 ? void 0 : windowSubject.unsubscribe();
      windowSubject = null;
    };
  });
}
window$2.window = window$1;
var windowCount$1 = {};
var __values$1 = commonjsGlobal && commonjsGlobal.__values || function(o) {
  var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
    next: function() {
      if (o && i >= o.length) o = void 0;
      return { value: o && o[i++], done: !o };
    }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(windowCount$1, "__esModule", { value: true });
windowCount$1.windowCount = void 0;
var Subject_1$3 = Subject$1;
var lift_1$5 = lift;
var OperatorSubscriber_1$4 = OperatorSubscriber$1;
function windowCount(windowSize, startWindowEvery) {
  if (startWindowEvery === void 0) {
    startWindowEvery = 0;
  }
  var startEvery = startWindowEvery > 0 ? startWindowEvery : windowSize;
  return lift_1$5.operate(function(source, subscriber) {
    var windows = [new Subject_1$3.Subject()];
    var count2 = 0;
    subscriber.next(windows[0].asObservable());
    source.subscribe(OperatorSubscriber_1$4.createOperatorSubscriber(subscriber, function(value) {
      var e_1, _a;
      try {
        for (var windows_1 = __values$1(windows), windows_1_1 = windows_1.next(); !windows_1_1.done; windows_1_1 = windows_1.next()) {
          var window_1 = windows_1_1.value;
          window_1.next(value);
        }
      } catch (e_1_1) {
        e_1 = { error: e_1_1 };
      } finally {
        try {
          if (windows_1_1 && !windows_1_1.done && (_a = windows_1.return)) _a.call(windows_1);
        } finally {
          if (e_1) throw e_1.error;
        }
      }
      var c = count2 - windowSize + 1;
      if (c >= 0 && c % startEvery === 0) {
        windows.shift().complete();
      }
      if (++count2 % startEvery === 0) {
        var window_2 = new Subject_1$3.Subject();
        windows.push(window_2);
        subscriber.next(window_2.asObservable());
      }
    }, function() {
      while (windows.length > 0) {
        windows.shift().complete();
      }
      subscriber.complete();
    }, function(err) {
      while (windows.length > 0) {
        windows.shift().error(err);
      }
      subscriber.error(err);
    }, function() {
      windows = null;
    }));
  });
}
windowCount$1.windowCount = windowCount;
var windowTime$1 = {};
Object.defineProperty(windowTime$1, "__esModule", { value: true });
windowTime$1.windowTime = void 0;
var Subject_1$2 = Subject$1;
var async_1 = async;
var Subscription_1$1 = Subscription$1;
var lift_1$4 = lift;
var OperatorSubscriber_1$3 = OperatorSubscriber$1;
var arrRemove_1$1 = arrRemove$1;
var args_1$1 = args;
var executeSchedule_1 = executeSchedule$1;
function windowTime(windowTimeSpan) {
  var _a, _b;
  var otherArgs = [];
  for (var _i = 1; _i < arguments.length; _i++) {
    otherArgs[_i - 1] = arguments[_i];
  }
  var scheduler = (_a = args_1$1.popScheduler(otherArgs)) !== null && _a !== void 0 ? _a : async_1.asyncScheduler;
  var windowCreationInterval = (_b = otherArgs[0]) !== null && _b !== void 0 ? _b : null;
  var maxWindowSize = otherArgs[1] || Infinity;
  return lift_1$4.operate(function(source, subscriber) {
    var windowRecords = [];
    var restartOnClose = false;
    var closeWindow = function(record) {
      var window2 = record.window, subs = record.subs;
      window2.complete();
      subs.unsubscribe();
      arrRemove_1$1.arrRemove(windowRecords, record);
      restartOnClose && startWindow();
    };
    var startWindow = function() {
      if (windowRecords) {
        var subs = new Subscription_1$1.Subscription();
        subscriber.add(subs);
        var window_1 = new Subject_1$2.Subject();
        var record_1 = {
          window: window_1,
          subs,
          seen: 0
        };
        windowRecords.push(record_1);
        subscriber.next(window_1.asObservable());
        executeSchedule_1.executeSchedule(subs, scheduler, function() {
          return closeWindow(record_1);
        }, windowTimeSpan);
      }
    };
    if (windowCreationInterval !== null && windowCreationInterval >= 0) {
      executeSchedule_1.executeSchedule(subscriber, scheduler, startWindow, windowCreationInterval, true);
    } else {
      restartOnClose = true;
    }
    startWindow();
    var loop = function(cb) {
      return windowRecords.slice().forEach(cb);
    };
    var terminate = function(cb) {
      loop(function(_a2) {
        var window2 = _a2.window;
        return cb(window2);
      });
      cb(subscriber);
      subscriber.unsubscribe();
    };
    source.subscribe(OperatorSubscriber_1$3.createOperatorSubscriber(subscriber, function(value) {
      loop(function(record) {
        record.window.next(value);
        maxWindowSize <= ++record.seen && closeWindow(record);
      });
    }, function() {
      return terminate(function(consumer) {
        return consumer.complete();
      });
    }, function(err) {
      return terminate(function(consumer) {
        return consumer.error(err);
      });
    }));
    return function() {
      windowRecords = null;
    };
  });
}
windowTime$1.windowTime = windowTime;
var windowToggle$1 = {};
var __values = commonjsGlobal && commonjsGlobal.__values || function(o) {
  var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
    next: function() {
      if (o && i >= o.length) o = void 0;
      return { value: o && o[i++], done: !o };
    }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(windowToggle$1, "__esModule", { value: true });
windowToggle$1.windowToggle = void 0;
var Subject_1$1 = Subject$1;
var Subscription_1 = Subscription$1;
var lift_1$3 = lift;
var innerFrom_1$2 = innerFrom$1;
var OperatorSubscriber_1$2 = OperatorSubscriber$1;
var noop_1$1 = noop$1;
var arrRemove_1 = arrRemove$1;
function windowToggle(openings, closingSelector) {
  return lift_1$3.operate(function(source, subscriber) {
    var windows = [];
    var handleError = function(err) {
      while (0 < windows.length) {
        windows.shift().error(err);
      }
      subscriber.error(err);
    };
    innerFrom_1$2.innerFrom(openings).subscribe(OperatorSubscriber_1$2.createOperatorSubscriber(subscriber, function(openValue) {
      var window2 = new Subject_1$1.Subject();
      windows.push(window2);
      var closingSubscription = new Subscription_1.Subscription();
      var closeWindow = function() {
        arrRemove_1.arrRemove(windows, window2);
        window2.complete();
        closingSubscription.unsubscribe();
      };
      var closingNotifier;
      try {
        closingNotifier = innerFrom_1$2.innerFrom(closingSelector(openValue));
      } catch (err) {
        handleError(err);
        return;
      }
      subscriber.next(window2.asObservable());
      closingSubscription.add(closingNotifier.subscribe(OperatorSubscriber_1$2.createOperatorSubscriber(subscriber, closeWindow, noop_1$1.noop, handleError)));
    }, noop_1$1.noop));
    source.subscribe(OperatorSubscriber_1$2.createOperatorSubscriber(subscriber, function(value) {
      var e_1, _a;
      var windowsCopy = windows.slice();
      try {
        for (var windowsCopy_1 = __values(windowsCopy), windowsCopy_1_1 = windowsCopy_1.next(); !windowsCopy_1_1.done; windowsCopy_1_1 = windowsCopy_1.next()) {
          var window_1 = windowsCopy_1_1.value;
          window_1.next(value);
        }
      } catch (e_1_1) {
        e_1 = { error: e_1_1 };
      } finally {
        try {
          if (windowsCopy_1_1 && !windowsCopy_1_1.done && (_a = windowsCopy_1.return)) _a.call(windowsCopy_1);
        } finally {
          if (e_1) throw e_1.error;
        }
      }
    }, function() {
      while (0 < windows.length) {
        windows.shift().complete();
      }
      subscriber.complete();
    }, handleError, function() {
      while (0 < windows.length) {
        windows.shift().unsubscribe();
      }
    }));
  });
}
windowToggle$1.windowToggle = windowToggle;
var windowWhen$1 = {};
Object.defineProperty(windowWhen$1, "__esModule", { value: true });
windowWhen$1.windowWhen = void 0;
var Subject_1 = Subject$1;
var lift_1$2 = lift;
var OperatorSubscriber_1$1 = OperatorSubscriber$1;
var innerFrom_1$1 = innerFrom$1;
function windowWhen(closingSelector) {
  return lift_1$2.operate(function(source, subscriber) {
    var window2;
    var closingSubscriber;
    var handleError = function(err) {
      window2.error(err);
      subscriber.error(err);
    };
    var openWindow = function() {
      closingSubscriber === null || closingSubscriber === void 0 ? void 0 : closingSubscriber.unsubscribe();
      window2 === null || window2 === void 0 ? void 0 : window2.complete();
      window2 = new Subject_1.Subject();
      subscriber.next(window2.asObservable());
      var closingNotifier;
      try {
        closingNotifier = innerFrom_1$1.innerFrom(closingSelector());
      } catch (err) {
        handleError(err);
        return;
      }
      closingNotifier.subscribe(closingSubscriber = OperatorSubscriber_1$1.createOperatorSubscriber(subscriber, openWindow, openWindow, handleError));
    };
    openWindow();
    source.subscribe(OperatorSubscriber_1$1.createOperatorSubscriber(subscriber, function(value) {
      return window2.next(value);
    }, function() {
      window2.complete();
      subscriber.complete();
    }, handleError, function() {
      closingSubscriber === null || closingSubscriber === void 0 ? void 0 : closingSubscriber.unsubscribe();
      window2 = null;
    }));
  });
}
windowWhen$1.windowWhen = windowWhen;
var withLatestFrom$1 = {};
var __read$2 = commonjsGlobal && commonjsGlobal.__read || function(o, n2) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
    while ((n2 === void 0 || n2-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar;
};
var __spreadArray$2 = commonjsGlobal && commonjsGlobal.__spreadArray || function(to, from2) {
  for (var i = 0, il = from2.length, j2 = to.length; i < il; i++, j2++)
    to[j2] = from2[i];
  return to;
};
Object.defineProperty(withLatestFrom$1, "__esModule", { value: true });
withLatestFrom$1.withLatestFrom = void 0;
var lift_1$1 = lift;
var OperatorSubscriber_1 = OperatorSubscriber$1;
var innerFrom_1 = innerFrom$1;
var identity_1 = identity$1;
var noop_1 = noop$1;
var args_1 = args;
function withLatestFrom() {
  var inputs = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    inputs[_i] = arguments[_i];
  }
  var project = args_1.popResultSelector(inputs);
  return lift_1$1.operate(function(source, subscriber) {
    var len = inputs.length;
    var otherValues = new Array(len);
    var hasValue = inputs.map(function() {
      return false;
    });
    var ready = false;
    var _loop_1 = function(i2) {
      innerFrom_1.innerFrom(inputs[i2]).subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
        otherValues[i2] = value;
        if (!ready && !hasValue[i2]) {
          hasValue[i2] = true;
          (ready = hasValue.every(identity_1.identity)) && (hasValue = null);
        }
      }, noop_1.noop));
    };
    for (var i = 0; i < len; i++) {
      _loop_1(i);
    }
    source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
      if (ready) {
        var values = __spreadArray$2([value], __read$2(otherValues));
        subscriber.next(project ? project.apply(void 0, __spreadArray$2([], __read$2(values))) : values);
      }
    }));
  });
}
withLatestFrom$1.withLatestFrom = withLatestFrom;
var zipAll$1 = {};
Object.defineProperty(zipAll$1, "__esModule", { value: true });
zipAll$1.zipAll = void 0;
var zip_1$2 = zip$3;
var joinAllInternals_1 = joinAllInternals$1;
function zipAll(project) {
  return joinAllInternals_1.joinAllInternals(zip_1$2.zip, project);
}
zipAll$1.zipAll = zipAll;
var zipWith$1 = {};
var zip$1 = {};
var __read$1 = commonjsGlobal && commonjsGlobal.__read || function(o, n2) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
    while ((n2 === void 0 || n2-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar;
};
var __spreadArray$1 = commonjsGlobal && commonjsGlobal.__spreadArray || function(to, from2) {
  for (var i = 0, il = from2.length, j2 = to.length; i < il; i++, j2++)
    to[j2] = from2[i];
  return to;
};
Object.defineProperty(zip$1, "__esModule", { value: true });
zip$1.zip = void 0;
var zip_1$1 = zip$3;
var lift_1 = lift;
function zip() {
  var sources = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    sources[_i] = arguments[_i];
  }
  return lift_1.operate(function(source, subscriber) {
    zip_1$1.zip.apply(void 0, __spreadArray$1([source], __read$1(sources))).subscribe(subscriber);
  });
}
zip$1.zip = zip;
var __read = commonjsGlobal && commonjsGlobal.__read || function(o, n2) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
    while ((n2 === void 0 || n2-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar;
};
var __spreadArray = commonjsGlobal && commonjsGlobal.__spreadArray || function(to, from2) {
  for (var i = 0, il = from2.length, j2 = to.length; i < il; i++, j2++)
    to[j2] = from2[i];
  return to;
};
Object.defineProperty(zipWith$1, "__esModule", { value: true });
zipWith$1.zipWith = void 0;
var zip_1 = zip$1;
function zipWith() {
  var otherInputs = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    otherInputs[_i] = arguments[_i];
  }
  return zip_1.zip.apply(void 0, __spreadArray([], __read(otherInputs)));
}
zipWith$1.zipWith = zipWith;
(function(exports) {
  var __createBinding = commonjsGlobal && commonjsGlobal.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() {
      return m[k];
    } });
  } : function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  });
  var __exportStar = commonjsGlobal && commonjsGlobal.__exportStar || function(m, exports2) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.interval = exports.iif = exports.generate = exports.fromEventPattern = exports.fromEvent = exports.from = exports.forkJoin = exports.empty = exports.defer = exports.connectable = exports.concat = exports.combineLatest = exports.bindNodeCallback = exports.bindCallback = exports.UnsubscriptionError = exports.TimeoutError = exports.SequenceError = exports.ObjectUnsubscribedError = exports.NotFoundError = exports.EmptyError = exports.ArgumentOutOfRangeError = exports.firstValueFrom = exports.lastValueFrom = exports.isObservable = exports.identity = exports.noop = exports.pipe = exports.NotificationKind = exports.Notification = exports.Subscriber = exports.Subscription = exports.Scheduler = exports.VirtualAction = exports.VirtualTimeScheduler = exports.animationFrameScheduler = exports.animationFrame = exports.queueScheduler = exports.queue = exports.asyncScheduler = exports.async = exports.asapScheduler = exports.asap = exports.AsyncSubject = exports.ReplaySubject = exports.BehaviorSubject = exports.Subject = exports.animationFrames = exports.observable = exports.ConnectableObservable = exports.Observable = void 0;
  exports.filter = exports.expand = exports.exhaustMap = exports.exhaustAll = exports.exhaust = exports.every = exports.endWith = exports.elementAt = exports.distinctUntilKeyChanged = exports.distinctUntilChanged = exports.distinct = exports.dematerialize = exports.delayWhen = exports.delay = exports.defaultIfEmpty = exports.debounceTime = exports.debounce = exports.count = exports.connect = exports.concatWith = exports.concatMapTo = exports.concatMap = exports.concatAll = exports.combineLatestWith = exports.combineLatestAll = exports.combineAll = exports.catchError = exports.bufferWhen = exports.bufferToggle = exports.bufferTime = exports.bufferCount = exports.buffer = exports.auditTime = exports.audit = exports.config = exports.NEVER = exports.EMPTY = exports.scheduled = exports.zip = exports.using = exports.timer = exports.throwError = exports.range = exports.race = exports.partition = exports.pairs = exports.onErrorResumeNext = exports.of = exports.never = exports.merge = void 0;
  exports.switchMap = exports.switchAll = exports.subscribeOn = exports.startWith = exports.skipWhile = exports.skipUntil = exports.skipLast = exports.skip = exports.single = exports.shareReplay = exports.share = exports.sequenceEqual = exports.scan = exports.sampleTime = exports.sample = exports.refCount = exports.retryWhen = exports.retry = exports.repeatWhen = exports.repeat = exports.reduce = exports.raceWith = exports.publishReplay = exports.publishLast = exports.publishBehavior = exports.publish = exports.pluck = exports.pairwise = exports.onErrorResumeNextWith = exports.observeOn = exports.multicast = exports.min = exports.mergeWith = exports.mergeScan = exports.mergeMapTo = exports.mergeMap = exports.flatMap = exports.mergeAll = exports.max = exports.materialize = exports.mapTo = exports.map = exports.last = exports.isEmpty = exports.ignoreElements = exports.groupBy = exports.first = exports.findIndex = exports.find = exports.finalize = void 0;
  exports.zipWith = exports.zipAll = exports.withLatestFrom = exports.windowWhen = exports.windowToggle = exports.windowTime = exports.windowCount = exports.window = exports.toArray = exports.timestamp = exports.timeoutWith = exports.timeout = exports.timeInterval = exports.throwIfEmpty = exports.throttleTime = exports.throttle = exports.tap = exports.takeWhile = exports.takeUntil = exports.takeLast = exports.take = exports.switchScan = exports.switchMapTo = void 0;
  var Observable_12 = Observable$1;
  Object.defineProperty(exports, "Observable", { enumerable: true, get: function() {
    return Observable_12.Observable;
  } });
  var ConnectableObservable_12 = ConnectableObservable$1;
  Object.defineProperty(exports, "ConnectableObservable", { enumerable: true, get: function() {
    return ConnectableObservable_12.ConnectableObservable;
  } });
  var observable_12 = observable;
  Object.defineProperty(exports, "observable", { enumerable: true, get: function() {
    return observable_12.observable;
  } });
  var animationFrames_1 = animationFrames$1;
  Object.defineProperty(exports, "animationFrames", { enumerable: true, get: function() {
    return animationFrames_1.animationFrames;
  } });
  var Subject_12 = Subject$1;
  Object.defineProperty(exports, "Subject", { enumerable: true, get: function() {
    return Subject_12.Subject;
  } });
  var BehaviorSubject_12 = BehaviorSubject$1;
  Object.defineProperty(exports, "BehaviorSubject", { enumerable: true, get: function() {
    return BehaviorSubject_12.BehaviorSubject;
  } });
  var ReplaySubject_12 = ReplaySubject$1;
  Object.defineProperty(exports, "ReplaySubject", { enumerable: true, get: function() {
    return ReplaySubject_12.ReplaySubject;
  } });
  var AsyncSubject_12 = AsyncSubject$1;
  Object.defineProperty(exports, "AsyncSubject", { enumerable: true, get: function() {
    return AsyncSubject_12.AsyncSubject;
  } });
  var asap_1 = asap;
  Object.defineProperty(exports, "asap", { enumerable: true, get: function() {
    return asap_1.asap;
  } });
  Object.defineProperty(exports, "asapScheduler", { enumerable: true, get: function() {
    return asap_1.asapScheduler;
  } });
  var async_12 = async;
  Object.defineProperty(exports, "async", { enumerable: true, get: function() {
    return async_12.async;
  } });
  Object.defineProperty(exports, "asyncScheduler", { enumerable: true, get: function() {
    return async_12.asyncScheduler;
  } });
  var queue_1 = queue;
  Object.defineProperty(exports, "queue", { enumerable: true, get: function() {
    return queue_1.queue;
  } });
  Object.defineProperty(exports, "queueScheduler", { enumerable: true, get: function() {
    return queue_1.queueScheduler;
  } });
  var animationFrame_1 = animationFrame;
  Object.defineProperty(exports, "animationFrame", { enumerable: true, get: function() {
    return animationFrame_1.animationFrame;
  } });
  Object.defineProperty(exports, "animationFrameScheduler", { enumerable: true, get: function() {
    return animationFrame_1.animationFrameScheduler;
  } });
  var VirtualTimeScheduler_1 = VirtualTimeScheduler$1;
  Object.defineProperty(exports, "VirtualTimeScheduler", { enumerable: true, get: function() {
    return VirtualTimeScheduler_1.VirtualTimeScheduler;
  } });
  Object.defineProperty(exports, "VirtualAction", { enumerable: true, get: function() {
    return VirtualTimeScheduler_1.VirtualAction;
  } });
  var Scheduler_12 = Scheduler$1;
  Object.defineProperty(exports, "Scheduler", { enumerable: true, get: function() {
    return Scheduler_12.Scheduler;
  } });
  var Subscription_12 = Subscription$1;
  Object.defineProperty(exports, "Subscription", { enumerable: true, get: function() {
    return Subscription_12.Subscription;
  } });
  var Subscriber_12 = Subscriber;
  Object.defineProperty(exports, "Subscriber", { enumerable: true, get: function() {
    return Subscriber_12.Subscriber;
  } });
  var Notification_12 = Notification;
  Object.defineProperty(exports, "Notification", { enumerable: true, get: function() {
    return Notification_12.Notification;
  } });
  Object.defineProperty(exports, "NotificationKind", { enumerable: true, get: function() {
    return Notification_12.NotificationKind;
  } });
  var pipe_12 = pipe$1;
  Object.defineProperty(exports, "pipe", { enumerable: true, get: function() {
    return pipe_12.pipe;
  } });
  var noop_12 = noop$1;
  Object.defineProperty(exports, "noop", { enumerable: true, get: function() {
    return noop_12.noop;
  } });
  var identity_12 = identity$1;
  Object.defineProperty(exports, "identity", { enumerable: true, get: function() {
    return identity_12.identity;
  } });
  var isObservable_1 = isObservable$1;
  Object.defineProperty(exports, "isObservable", { enumerable: true, get: function() {
    return isObservable_1.isObservable;
  } });
  var lastValueFrom_1 = lastValueFrom$1;
  Object.defineProperty(exports, "lastValueFrom", { enumerable: true, get: function() {
    return lastValueFrom_1.lastValueFrom;
  } });
  var firstValueFrom_1 = firstValueFrom$1;
  Object.defineProperty(exports, "firstValueFrom", { enumerable: true, get: function() {
    return firstValueFrom_1.firstValueFrom;
  } });
  var ArgumentOutOfRangeError_12 = ArgumentOutOfRangeError;
  Object.defineProperty(exports, "ArgumentOutOfRangeError", { enumerable: true, get: function() {
    return ArgumentOutOfRangeError_12.ArgumentOutOfRangeError;
  } });
  var EmptyError_12 = EmptyError;
  Object.defineProperty(exports, "EmptyError", { enumerable: true, get: function() {
    return EmptyError_12.EmptyError;
  } });
  var NotFoundError_12 = NotFoundError;
  Object.defineProperty(exports, "NotFoundError", { enumerable: true, get: function() {
    return NotFoundError_12.NotFoundError;
  } });
  var ObjectUnsubscribedError_12 = ObjectUnsubscribedError;
  Object.defineProperty(exports, "ObjectUnsubscribedError", { enumerable: true, get: function() {
    return ObjectUnsubscribedError_12.ObjectUnsubscribedError;
  } });
  var SequenceError_12 = SequenceError;
  Object.defineProperty(exports, "SequenceError", { enumerable: true, get: function() {
    return SequenceError_12.SequenceError;
  } });
  var timeout_12 = timeout;
  Object.defineProperty(exports, "TimeoutError", { enumerable: true, get: function() {
    return timeout_12.TimeoutError;
  } });
  var UnsubscriptionError_12 = UnsubscriptionError;
  Object.defineProperty(exports, "UnsubscriptionError", { enumerable: true, get: function() {
    return UnsubscriptionError_12.UnsubscriptionError;
  } });
  var bindCallback_1 = bindCallback$1;
  Object.defineProperty(exports, "bindCallback", { enumerable: true, get: function() {
    return bindCallback_1.bindCallback;
  } });
  var bindNodeCallback_1 = bindNodeCallback$1;
  Object.defineProperty(exports, "bindNodeCallback", { enumerable: true, get: function() {
    return bindNodeCallback_1.bindNodeCallback;
  } });
  var combineLatest_12 = combineLatest$3;
  Object.defineProperty(exports, "combineLatest", { enumerable: true, get: function() {
    return combineLatest_12.combineLatest;
  } });
  var concat_12 = concat$3;
  Object.defineProperty(exports, "concat", { enumerable: true, get: function() {
    return concat_12.concat;
  } });
  var connectable_1 = connectable$1;
  Object.defineProperty(exports, "connectable", { enumerable: true, get: function() {
    return connectable_1.connectable;
  } });
  var defer_12 = defer$1;
  Object.defineProperty(exports, "defer", { enumerable: true, get: function() {
    return defer_12.defer;
  } });
  var empty_12 = empty;
  Object.defineProperty(exports, "empty", { enumerable: true, get: function() {
    return empty_12.empty;
  } });
  var forkJoin_1 = forkJoin$1;
  Object.defineProperty(exports, "forkJoin", { enumerable: true, get: function() {
    return forkJoin_1.forkJoin;
  } });
  var from_12 = from$1;
  Object.defineProperty(exports, "from", { enumerable: true, get: function() {
    return from_12.from;
  } });
  var fromEvent_1 = fromEvent$1;
  Object.defineProperty(exports, "fromEvent", { enumerable: true, get: function() {
    return fromEvent_1.fromEvent;
  } });
  var fromEventPattern_1 = fromEventPattern$1;
  Object.defineProperty(exports, "fromEventPattern", { enumerable: true, get: function() {
    return fromEventPattern_1.fromEventPattern;
  } });
  var generate_1 = generate$1;
  Object.defineProperty(exports, "generate", { enumerable: true, get: function() {
    return generate_1.generate;
  } });
  var iif_1 = iif$1;
  Object.defineProperty(exports, "iif", { enumerable: true, get: function() {
    return iif_1.iif;
  } });
  var interval_12 = interval$1;
  Object.defineProperty(exports, "interval", { enumerable: true, get: function() {
    return interval_12.interval;
  } });
  var merge_12 = merge$3;
  Object.defineProperty(exports, "merge", { enumerable: true, get: function() {
    return merge_12.merge;
  } });
  var never_1 = never;
  Object.defineProperty(exports, "never", { enumerable: true, get: function() {
    return never_1.never;
  } });
  var of_12 = of$1;
  Object.defineProperty(exports, "of", { enumerable: true, get: function() {
    return of_12.of;
  } });
  var onErrorResumeNext_12 = onErrorResumeNext$1;
  Object.defineProperty(exports, "onErrorResumeNext", { enumerable: true, get: function() {
    return onErrorResumeNext_12.onErrorResumeNext;
  } });
  var pairs_1 = pairs$1;
  Object.defineProperty(exports, "pairs", { enumerable: true, get: function() {
    return pairs_1.pairs;
  } });
  var partition_1 = partition$1;
  Object.defineProperty(exports, "partition", { enumerable: true, get: function() {
    return partition_1.partition;
  } });
  var race_12 = race$1;
  Object.defineProperty(exports, "race", { enumerable: true, get: function() {
    return race_12.race;
  } });
  var range_1 = range$1;
  Object.defineProperty(exports, "range", { enumerable: true, get: function() {
    return range_1.range;
  } });
  var throwError_1 = throwError$1;
  Object.defineProperty(exports, "throwError", { enumerable: true, get: function() {
    return throwError_1.throwError;
  } });
  var timer_12 = timer$1;
  Object.defineProperty(exports, "timer", { enumerable: true, get: function() {
    return timer_12.timer;
  } });
  var using_1 = using$1;
  Object.defineProperty(exports, "using", { enumerable: true, get: function() {
    return using_1.using;
  } });
  var zip_12 = zip$3;
  Object.defineProperty(exports, "zip", { enumerable: true, get: function() {
    return zip_12.zip;
  } });
  var scheduled_12 = scheduled$1;
  Object.defineProperty(exports, "scheduled", { enumerable: true, get: function() {
    return scheduled_12.scheduled;
  } });
  var empty_2 = empty;
  Object.defineProperty(exports, "EMPTY", { enumerable: true, get: function() {
    return empty_2.EMPTY;
  } });
  var never_2 = never;
  Object.defineProperty(exports, "NEVER", { enumerable: true, get: function() {
    return never_2.NEVER;
  } });
  __exportStar(types, exports);
  var config_12 = config;
  Object.defineProperty(exports, "config", { enumerable: true, get: function() {
    return config_12.config;
  } });
  var audit_12 = audit$1;
  Object.defineProperty(exports, "audit", { enumerable: true, get: function() {
    return audit_12.audit;
  } });
  var auditTime_1 = auditTime$1;
  Object.defineProperty(exports, "auditTime", { enumerable: true, get: function() {
    return auditTime_1.auditTime;
  } });
  var buffer_1 = buffer$1;
  Object.defineProperty(exports, "buffer", { enumerable: true, get: function() {
    return buffer_1.buffer;
  } });
  var bufferCount_1 = bufferCount$1;
  Object.defineProperty(exports, "bufferCount", { enumerable: true, get: function() {
    return bufferCount_1.bufferCount;
  } });
  var bufferTime_1 = bufferTime$1;
  Object.defineProperty(exports, "bufferTime", { enumerable: true, get: function() {
    return bufferTime_1.bufferTime;
  } });
  var bufferToggle_1 = bufferToggle$1;
  Object.defineProperty(exports, "bufferToggle", { enumerable: true, get: function() {
    return bufferToggle_1.bufferToggle;
  } });
  var bufferWhen_1 = bufferWhen$1;
  Object.defineProperty(exports, "bufferWhen", { enumerable: true, get: function() {
    return bufferWhen_1.bufferWhen;
  } });
  var catchError_1 = catchError$1;
  Object.defineProperty(exports, "catchError", { enumerable: true, get: function() {
    return catchError_1.catchError;
  } });
  var combineAll_1 = combineAll;
  Object.defineProperty(exports, "combineAll", { enumerable: true, get: function() {
    return combineAll_1.combineAll;
  } });
  var combineLatestAll_12 = combineLatestAll$1;
  Object.defineProperty(exports, "combineLatestAll", { enumerable: true, get: function() {
    return combineLatestAll_12.combineLatestAll;
  } });
  var combineLatestWith_1 = combineLatestWith$1;
  Object.defineProperty(exports, "combineLatestWith", { enumerable: true, get: function() {
    return combineLatestWith_1.combineLatestWith;
  } });
  var concatAll_12 = concatAll$1;
  Object.defineProperty(exports, "concatAll", { enumerable: true, get: function() {
    return concatAll_12.concatAll;
  } });
  var concatMap_12 = concatMap$1;
  Object.defineProperty(exports, "concatMap", { enumerable: true, get: function() {
    return concatMap_12.concatMap;
  } });
  var concatMapTo_1 = concatMapTo$1;
  Object.defineProperty(exports, "concatMapTo", { enumerable: true, get: function() {
    return concatMapTo_1.concatMapTo;
  } });
  var concatWith_1 = concatWith$1;
  Object.defineProperty(exports, "concatWith", { enumerable: true, get: function() {
    return concatWith_1.concatWith;
  } });
  var connect_12 = connect$1;
  Object.defineProperty(exports, "connect", { enumerable: true, get: function() {
    return connect_12.connect;
  } });
  var count_1 = count$1;
  Object.defineProperty(exports, "count", { enumerable: true, get: function() {
    return count_1.count;
  } });
  var debounce_1 = debounce$1;
  Object.defineProperty(exports, "debounce", { enumerable: true, get: function() {
    return debounce_1.debounce;
  } });
  var debounceTime_1 = debounceTime$1;
  Object.defineProperty(exports, "debounceTime", { enumerable: true, get: function() {
    return debounceTime_1.debounceTime;
  } });
  var defaultIfEmpty_12 = defaultIfEmpty$1;
  Object.defineProperty(exports, "defaultIfEmpty", { enumerable: true, get: function() {
    return defaultIfEmpty_12.defaultIfEmpty;
  } });
  var delay_1 = delay$1;
  Object.defineProperty(exports, "delay", { enumerable: true, get: function() {
    return delay_1.delay;
  } });
  var delayWhen_12 = delayWhen$1;
  Object.defineProperty(exports, "delayWhen", { enumerable: true, get: function() {
    return delayWhen_12.delayWhen;
  } });
  var dematerialize_1 = dematerialize$1;
  Object.defineProperty(exports, "dematerialize", { enumerable: true, get: function() {
    return dematerialize_1.dematerialize;
  } });
  var distinct_1 = distinct$1;
  Object.defineProperty(exports, "distinct", { enumerable: true, get: function() {
    return distinct_1.distinct;
  } });
  var distinctUntilChanged_12 = distinctUntilChanged$1;
  Object.defineProperty(exports, "distinctUntilChanged", { enumerable: true, get: function() {
    return distinctUntilChanged_12.distinctUntilChanged;
  } });
  var distinctUntilKeyChanged_1 = distinctUntilKeyChanged$1;
  Object.defineProperty(exports, "distinctUntilKeyChanged", { enumerable: true, get: function() {
    return distinctUntilKeyChanged_1.distinctUntilKeyChanged;
  } });
  var elementAt_1 = elementAt$1;
  Object.defineProperty(exports, "elementAt", { enumerable: true, get: function() {
    return elementAt_1.elementAt;
  } });
  var endWith_1 = endWith$1;
  Object.defineProperty(exports, "endWith", { enumerable: true, get: function() {
    return endWith_1.endWith;
  } });
  var every_1 = every$1;
  Object.defineProperty(exports, "every", { enumerable: true, get: function() {
    return every_1.every;
  } });
  var exhaust_1 = exhaust;
  Object.defineProperty(exports, "exhaust", { enumerable: true, get: function() {
    return exhaust_1.exhaust;
  } });
  var exhaustAll_12 = exhaustAll$1;
  Object.defineProperty(exports, "exhaustAll", { enumerable: true, get: function() {
    return exhaustAll_12.exhaustAll;
  } });
  var exhaustMap_12 = exhaustMap$1;
  Object.defineProperty(exports, "exhaustMap", { enumerable: true, get: function() {
    return exhaustMap_12.exhaustMap;
  } });
  var expand_1 = expand$1;
  Object.defineProperty(exports, "expand", { enumerable: true, get: function() {
    return expand_1.expand;
  } });
  var filter_12 = filter$1;
  Object.defineProperty(exports, "filter", { enumerable: true, get: function() {
    return filter_12.filter;
  } });
  var finalize_1 = finalize$1;
  Object.defineProperty(exports, "finalize", { enumerable: true, get: function() {
    return finalize_1.finalize;
  } });
  var find_12 = find$1;
  Object.defineProperty(exports, "find", { enumerable: true, get: function() {
    return find_12.find;
  } });
  var findIndex_1 = findIndex$1;
  Object.defineProperty(exports, "findIndex", { enumerable: true, get: function() {
    return findIndex_1.findIndex;
  } });
  var first_1 = first$1;
  Object.defineProperty(exports, "first", { enumerable: true, get: function() {
    return first_1.first;
  } });
  var groupBy_1 = groupBy$1;
  Object.defineProperty(exports, "groupBy", { enumerable: true, get: function() {
    return groupBy_1.groupBy;
  } });
  var ignoreElements_12 = ignoreElements$1;
  Object.defineProperty(exports, "ignoreElements", { enumerable: true, get: function() {
    return ignoreElements_12.ignoreElements;
  } });
  var isEmpty_1 = isEmpty$1;
  Object.defineProperty(exports, "isEmpty", { enumerable: true, get: function() {
    return isEmpty_1.isEmpty;
  } });
  var last_1 = last$1;
  Object.defineProperty(exports, "last", { enumerable: true, get: function() {
    return last_1.last;
  } });
  var map_12 = map$1;
  Object.defineProperty(exports, "map", { enumerable: true, get: function() {
    return map_12.map;
  } });
  var mapTo_12 = mapTo$1;
  Object.defineProperty(exports, "mapTo", { enumerable: true, get: function() {
    return mapTo_12.mapTo;
  } });
  var materialize_1 = materialize$1;
  Object.defineProperty(exports, "materialize", { enumerable: true, get: function() {
    return materialize_1.materialize;
  } });
  var max_1 = max$1;
  Object.defineProperty(exports, "max", { enumerable: true, get: function() {
    return max_1.max;
  } });
  var mergeAll_12 = mergeAll$1;
  Object.defineProperty(exports, "mergeAll", { enumerable: true, get: function() {
    return mergeAll_12.mergeAll;
  } });
  var flatMap_1 = flatMap;
  Object.defineProperty(exports, "flatMap", { enumerable: true, get: function() {
    return flatMap_1.flatMap;
  } });
  var mergeMap_12 = mergeMap$1;
  Object.defineProperty(exports, "mergeMap", { enumerable: true, get: function() {
    return mergeMap_12.mergeMap;
  } });
  var mergeMapTo_1 = mergeMapTo$1;
  Object.defineProperty(exports, "mergeMapTo", { enumerable: true, get: function() {
    return mergeMapTo_1.mergeMapTo;
  } });
  var mergeScan_1 = mergeScan$1;
  Object.defineProperty(exports, "mergeScan", { enumerable: true, get: function() {
    return mergeScan_1.mergeScan;
  } });
  var mergeWith_1 = mergeWith$1;
  Object.defineProperty(exports, "mergeWith", { enumerable: true, get: function() {
    return mergeWith_1.mergeWith;
  } });
  var min_1 = min$1;
  Object.defineProperty(exports, "min", { enumerable: true, get: function() {
    return min_1.min;
  } });
  var multicast_12 = multicast$1;
  Object.defineProperty(exports, "multicast", { enumerable: true, get: function() {
    return multicast_12.multicast;
  } });
  var observeOn_12 = observeOn$1;
  Object.defineProperty(exports, "observeOn", { enumerable: true, get: function() {
    return observeOn_12.observeOn;
  } });
  var onErrorResumeNextWith_1 = onErrorResumeNextWith$1;
  Object.defineProperty(exports, "onErrorResumeNextWith", { enumerable: true, get: function() {
    return onErrorResumeNextWith_1.onErrorResumeNextWith;
  } });
  var pairwise_1 = pairwise$1;
  Object.defineProperty(exports, "pairwise", { enumerable: true, get: function() {
    return pairwise_1.pairwise;
  } });
  var pluck_1 = pluck$1;
  Object.defineProperty(exports, "pluck", { enumerable: true, get: function() {
    return pluck_1.pluck;
  } });
  var publish_1 = publish$1;
  Object.defineProperty(exports, "publish", { enumerable: true, get: function() {
    return publish_1.publish;
  } });
  var publishBehavior_1 = publishBehavior$1;
  Object.defineProperty(exports, "publishBehavior", { enumerable: true, get: function() {
    return publishBehavior_1.publishBehavior;
  } });
  var publishLast_1 = publishLast$1;
  Object.defineProperty(exports, "publishLast", { enumerable: true, get: function() {
    return publishLast_1.publishLast;
  } });
  var publishReplay_1 = publishReplay$1;
  Object.defineProperty(exports, "publishReplay", { enumerable: true, get: function() {
    return publishReplay_1.publishReplay;
  } });
  var raceWith_1 = raceWith$1;
  Object.defineProperty(exports, "raceWith", { enumerable: true, get: function() {
    return raceWith_1.raceWith;
  } });
  var reduce_12 = reduce$1;
  Object.defineProperty(exports, "reduce", { enumerable: true, get: function() {
    return reduce_12.reduce;
  } });
  var repeat_1 = repeat$1;
  Object.defineProperty(exports, "repeat", { enumerable: true, get: function() {
    return repeat_1.repeat;
  } });
  var repeatWhen_1 = repeatWhen$1;
  Object.defineProperty(exports, "repeatWhen", { enumerable: true, get: function() {
    return repeatWhen_1.repeatWhen;
  } });
  var retry_1 = retry$1;
  Object.defineProperty(exports, "retry", { enumerable: true, get: function() {
    return retry_1.retry;
  } });
  var retryWhen_1 = retryWhen$1;
  Object.defineProperty(exports, "retryWhen", { enumerable: true, get: function() {
    return retryWhen_1.retryWhen;
  } });
  var refCount_12 = refCount$1;
  Object.defineProperty(exports, "refCount", { enumerable: true, get: function() {
    return refCount_12.refCount;
  } });
  var sample_12 = sample$1;
  Object.defineProperty(exports, "sample", { enumerable: true, get: function() {
    return sample_12.sample;
  } });
  var sampleTime_1 = sampleTime$1;
  Object.defineProperty(exports, "sampleTime", { enumerable: true, get: function() {
    return sampleTime_1.sampleTime;
  } });
  var scan_1 = scan$1;
  Object.defineProperty(exports, "scan", { enumerable: true, get: function() {
    return scan_1.scan;
  } });
  var sequenceEqual_1 = sequenceEqual$1;
  Object.defineProperty(exports, "sequenceEqual", { enumerable: true, get: function() {
    return sequenceEqual_1.sequenceEqual;
  } });
  var share_12 = share$1;
  Object.defineProperty(exports, "share", { enumerable: true, get: function() {
    return share_12.share;
  } });
  var shareReplay_1 = shareReplay$1;
  Object.defineProperty(exports, "shareReplay", { enumerable: true, get: function() {
    return shareReplay_1.shareReplay;
  } });
  var single_1 = single$1;
  Object.defineProperty(exports, "single", { enumerable: true, get: function() {
    return single_1.single;
  } });
  var skip_1 = skip$1;
  Object.defineProperty(exports, "skip", { enumerable: true, get: function() {
    return skip_1.skip;
  } });
  var skipLast_1 = skipLast$1;
  Object.defineProperty(exports, "skipLast", { enumerable: true, get: function() {
    return skipLast_1.skipLast;
  } });
  var skipUntil_1 = skipUntil$1;
  Object.defineProperty(exports, "skipUntil", { enumerable: true, get: function() {
    return skipUntil_1.skipUntil;
  } });
  var skipWhile_1 = skipWhile$1;
  Object.defineProperty(exports, "skipWhile", { enumerable: true, get: function() {
    return skipWhile_1.skipWhile;
  } });
  var startWith_1 = startWith$1;
  Object.defineProperty(exports, "startWith", { enumerable: true, get: function() {
    return startWith_1.startWith;
  } });
  var subscribeOn_12 = subscribeOn$1;
  Object.defineProperty(exports, "subscribeOn", { enumerable: true, get: function() {
    return subscribeOn_12.subscribeOn;
  } });
  var switchAll_1 = switchAll$1;
  Object.defineProperty(exports, "switchAll", { enumerable: true, get: function() {
    return switchAll_1.switchAll;
  } });
  var switchMap_12 = switchMap$1;
  Object.defineProperty(exports, "switchMap", { enumerable: true, get: function() {
    return switchMap_12.switchMap;
  } });
  var switchMapTo_1 = switchMapTo$1;
  Object.defineProperty(exports, "switchMapTo", { enumerable: true, get: function() {
    return switchMapTo_1.switchMapTo;
  } });
  var switchScan_1 = switchScan$1;
  Object.defineProperty(exports, "switchScan", { enumerable: true, get: function() {
    return switchScan_1.switchScan;
  } });
  var take_12 = take$1;
  Object.defineProperty(exports, "take", { enumerable: true, get: function() {
    return take_12.take;
  } });
  var takeLast_12 = takeLast$1;
  Object.defineProperty(exports, "takeLast", { enumerable: true, get: function() {
    return takeLast_12.takeLast;
  } });
  var takeUntil_1 = takeUntil$1;
  Object.defineProperty(exports, "takeUntil", { enumerable: true, get: function() {
    return takeUntil_1.takeUntil;
  } });
  var takeWhile_1 = takeWhile$1;
  Object.defineProperty(exports, "takeWhile", { enumerable: true, get: function() {
    return takeWhile_1.takeWhile;
  } });
  var tap_1 = tap$1;
  Object.defineProperty(exports, "tap", { enumerable: true, get: function() {
    return tap_1.tap;
  } });
  var throttle_12 = throttle$1;
  Object.defineProperty(exports, "throttle", { enumerable: true, get: function() {
    return throttle_12.throttle;
  } });
  var throttleTime_1 = throttleTime$1;
  Object.defineProperty(exports, "throttleTime", { enumerable: true, get: function() {
    return throttleTime_1.throttleTime;
  } });
  var throwIfEmpty_12 = throwIfEmpty$1;
  Object.defineProperty(exports, "throwIfEmpty", { enumerable: true, get: function() {
    return throwIfEmpty_12.throwIfEmpty;
  } });
  var timeInterval_1 = timeInterval$1;
  Object.defineProperty(exports, "timeInterval", { enumerable: true, get: function() {
    return timeInterval_1.timeInterval;
  } });
  var timeout_2 = timeout;
  Object.defineProperty(exports, "timeout", { enumerable: true, get: function() {
    return timeout_2.timeout;
  } });
  var timeoutWith_1 = timeoutWith$1;
  Object.defineProperty(exports, "timeoutWith", { enumerable: true, get: function() {
    return timeoutWith_1.timeoutWith;
  } });
  var timestamp_1 = timestamp$1;
  Object.defineProperty(exports, "timestamp", { enumerable: true, get: function() {
    return timestamp_1.timestamp;
  } });
  var toArray_12 = toArray$1;
  Object.defineProperty(exports, "toArray", { enumerable: true, get: function() {
    return toArray_12.toArray;
  } });
  var window_1 = window$2;
  Object.defineProperty(exports, "window", { enumerable: true, get: function() {
    return window_1.window;
  } });
  var windowCount_1 = windowCount$1;
  Object.defineProperty(exports, "windowCount", { enumerable: true, get: function() {
    return windowCount_1.windowCount;
  } });
  var windowTime_1 = windowTime$1;
  Object.defineProperty(exports, "windowTime", { enumerable: true, get: function() {
    return windowTime_1.windowTime;
  } });
  var windowToggle_1 = windowToggle$1;
  Object.defineProperty(exports, "windowToggle", { enumerable: true, get: function() {
    return windowToggle_1.windowToggle;
  } });
  var windowWhen_1 = windowWhen$1;
  Object.defineProperty(exports, "windowWhen", { enumerable: true, get: function() {
    return windowWhen_1.windowWhen;
  } });
  var withLatestFrom_1 = withLatestFrom$1;
  Object.defineProperty(exports, "withLatestFrom", { enumerable: true, get: function() {
    return withLatestFrom_1.withLatestFrom;
  } });
  var zipAll_1 = zipAll$1;
  Object.defineProperty(exports, "zipAll", { enumerable: true, get: function() {
    return zipAll_1.zipAll;
  } });
  var zipWith_1 = zipWith$1;
  Object.defineProperty(exports, "zipWith", { enumerable: true, get: function() {
    return zipWith_1.zipWith;
  } });
})(cjs);
const x = (e) => ({ context: t }) => {
  const { count: s, include: n2, exclude: a, responseType: r = "message.received" } = e;
  return { count: s, domain: t.domain, from: t.connectTo, include: n2 ? Array.isArray(n2) ? n2 : [n2] : [], exclude: a ? Array.isArray(a) ? a : [a] : [], responseType: r, target: t.target, to: t.name };
}, T = cjs.defer(() => cjs.fromEvent(window, "message")), E = (e) => fromEventObservable(({ input: t }) => {
  return T.pipe(e ? cjs.map(e) : cjs.pipe(), cjs.filter(/* @__PURE__ */ ((e2) => (t2) => {
    const { data: s2 } = t2;
    return (!e2.include.length || e2.include.includes(s2.type)) && (!e2.exclude.length || !e2.exclude.includes(s2.type)) && s2.domain === e2.domain && s2.from === e2.from && s2.to === e2.to && (!e2.target || t2.source === e2.target);
  })(t)), cjs.map((s = t.responseType, (e2) => ({ type: s, message: e2 }))), t.count ? cjs.pipe(cjs.bufferCount(t.count), cjs.concatMap((e2) => e2), cjs.take(t.count)) : cjs.pipe());
  var s;
}), I = "sanity/comlink", O = "comlink/response", $ = "comlink/heartbeat", A = "comlink/disconnect", B = "comlink/handshake/syn", M = "comlink/handshake/syn-ack", j = "comlink/handshake/ack", D = () => setup({ types: {}, actors: { listen: fromEventObservable(({ input: e }) => {
  const t = e.signal ? cjs.fromEvent(e.signal, "abort").pipe((s = `Request ${e.requestId} aborted`, (e2) => e2.pipe(cjs.take(1), cjs.map(() => {
    throw new Error(s);
  })))) : cjs.EMPTY;
  var s;
  return cjs.fromEvent(window, "message").pipe(cjs.filter((t2) => t2.data?.type === O && t2.data?.responseTo === e.requestId && !!t2.source && e.sources.has(t2.source)), cjs.take(e.sources.size), cjs.takeUntil(t));
}) }, actions: { "send message": ({ context: e }, t) => {
  const { sources: s, targetOrigin: n2 } = e, { message: a } = t;
  s.forEach((e2) => {
    e2.postMessage(a, { targetOrigin: n2 });
  });
}, "on success": sendTo(({ context: e }) => e.parentRef, ({ context: e, self: t }) => (e.response && e.resolvable?.resolve(e.response), { type: "request.success", requestId: t.id, response: e.response, responseTo: e.responseTo })), "on fail": sendTo(({ context: e }) => e.parentRef, ({ context: e, self: t }) => (console.warn(`Received no response to message '${e.type}' on client '${e.from}' (ID: '${e.id}').`), e.resolvable?.reject(new Error("No response received")), { type: "request.failed", requestId: t.id })), "on abort": sendTo(({ context: e }) => e.parentRef, ({ context: e, self: t }) => (e.resolvable?.reject(new Error("Request aborted")), { type: "request.aborted", requestId: t.id })) }, guards: { expectsResponse: ({ context: e }) => e.expectResponse }, delays: { initialTimeout: 0, responseTimeout: 1e4 } }).createMachine({ context: ({ input: t }) => ({ connectionId: t.connectionId, data: t.data, domain: t.domain, expectResponse: t.expectResponse ?? false, from: t.from, id: `msg-${v4()}`, parentRef: t.parentRef, resolvable: t.resolvable, response: null, responseTo: t.responseTo, signal: t.signal, sources: t.sources instanceof Set ? t.sources : /* @__PURE__ */ new Set([t.sources]), targetOrigin: t.targetOrigin, to: t.to, type: t.type }), initial: "idle", on: { abort: ".aborted" }, states: { idle: { after: { initialTimeout: [{ target: "sending" }] } }, sending: { entry: { type: "send message", params: ({ context: e }) => {
  const { connectionId: t, data: s, domain: n2, from: a, id: r, responseTo: o, to: i, type: c } = e;
  return { message: { connectionId: t, data: s, domain: n2, from: a, id: r, to: i, type: c, responseTo: o } };
} }, always: [{ guard: "expectsResponse", target: "awaiting" }, "success"] }, awaiting: { invoke: { id: "listen for response", src: "listen", input: ({ context: e }) => ({ requestId: e.id, sources: e.sources, signal: e.signal }), onError: "aborted" }, after: { responseTimeout: "failed" }, on: { message: { actions: assign({ response: ({ event: e }) => e.data.data, responseTo: ({ event: e }) => e.data.responseTo }), target: "success" } } }, failed: { type: "final", entry: "on fail" }, success: { type: "final", entry: "on success" }, aborted: { type: "final", entry: "on abort" } }, output: ({ context: e, self: t }) => ({ requestId: t.id, response: e.response, responseTo: e.responseTo }) }), H = () => setup({ types: {}, actors: { requestMachine: D(), listen: E() }, actions: { "buffer incoming message": assign({ handshakeBuffer: ({ event: e, context: t }) => (assertEvent(e, "message.received"), [...t.handshakeBuffer, e]) }), "buffer message": enqueueActions(({ enqueue: e }) => {
  e.assign({ buffer: ({ event: e2, context: t }) => (assertEvent(e2, "post"), [...t.buffer, { data: e2.data, resolvable: e2.resolvable, signal: e2.signal }]) }), e.emit(({ event: e2 }) => (assertEvent(e2, "post"), { type: "_buffer.added", message: e2.data }));
}), "create request": assign({ requests: ({ context: t, event: s, self: n2, spawn: a }) => {
  assertEvent(s, "request");
  const r = (Array.isArray(s.data) ? s.data : [s.data]).map((s2) => {
    const r2 = `req-${v4()}`;
    return a("requestMachine", { id: r2, input: { connectionId: t.connectionId, data: s2.data, domain: t.domain, expectResponse: s2.expectResponse, from: t.name, parentRef: n2, resolvable: s2.resolvable, responseTo: s2.responseTo, sources: t.target, targetOrigin: t.targetOrigin, to: t.connectTo, type: s2.type, signal: s2.signal } });
  });
  return [...t.requests, ...r];
} }), "emit heartbeat": emit(() => ({ type: "_heartbeat" })), "emit received message": enqueueActions(({ enqueue: e }) => {
  e.emit(({ event: e2 }) => (assertEvent(e2, "message.received"), { type: "_message", message: e2.message.data })), e.emit(({ event: e2 }) => (assertEvent(e2, "message.received"), { type: e2.message.data.type, message: e2.message.data }));
}), "flush buffer": enqueueActions(({ enqueue: e }) => {
  e.raise(({ context: e2 }) => ({ type: "request", data: e2.buffer.map(({ data: e3, resolvable: t, signal: s }) => ({ data: e3.data, type: e3.type, expectResponse: !!t, resolvable: t, signal: s })) })), e.emit(({ context: e2 }) => ({ type: "_buffer.flushed", messages: e2.buffer.map(({ data: e3 }) => e3) })), e.assign({ buffer: [] });
}), "flush handshake buffer": enqueueActions(({ context: e, enqueue: t }) => {
  e.handshakeBuffer.forEach((e2) => t.raise(e2)), t.assign({ handshakeBuffer: [] });
}), post: raise(({ event: e }) => (assertEvent(e, "post"), { type: "request", data: { data: e.data.data, expectResponse: !!e.resolvable, type: e.data.type, resolvable: e.resolvable, signal: e.signal } })), "remove request": enqueueActions(({ context: e, enqueue: t, event: s }) => {
  assertEvent(s, ["request.success", "request.failed", "request.aborted"]), stopChild(s.requestId), t.assign({ requests: e.requests.filter(({ id: e2 }) => e2 !== s.requestId) });
}), "send response": raise(({ event: e }) => (assertEvent(e, ["message.received", "heartbeat.received"]), { type: "request", data: { type: O, responseTo: e.message.data.id, data: void 0 } })), "send handshake syn ack": raise({ type: "request", data: { type: M } }), "set connection config": assign({ connectionId: ({ event: e }) => (assertEvent(e, "message.received"), e.message.data.connectionId), target: ({ event: e }) => (assertEvent(e, "message.received"), e.message.source || void 0), targetOrigin: ({ event: e }) => (assertEvent(e, "message.received"), e.message.origin) }) }, guards: { hasSource: ({ context: e }) => null !== e.target } }).createMachine({ id: "node", context: ({ input: e }) => ({ buffer: [], connectionId: null, connectTo: e.connectTo, domain: e.domain ?? I, handshakeBuffer: [], name: e.name, requests: [], target: void 0, targetOrigin: null }), on: { "request.success": { actions: "remove request" }, "request.failed": { actions: "remove request" }, "request.aborted": { actions: "remove request" } }, initial: "idle", states: { idle: { invoke: { id: "listen for handshake syn", src: "listen", input: x({ include: B, count: 1 }), onDone: { target: "handshaking", guard: "hasSource" } }, on: { "message.received": { actions: "set connection config" }, post: { actions: "buffer message" } } }, handshaking: { entry: "send handshake syn ack", invoke: [{ id: "listen for handshake ack", src: "listen", input: x({ include: j, count: 1, responseType: "handshake.complete" }), onDone: "connected" }, { id: "listen for disconnect", src: "listen", input: x({ include: A, count: 1, responseType: "disconnect" }) }, { id: "listen for messages", src: "listen", input: x({ exclude: [A, j, $, O] }) }], on: { request: { actions: "create request" }, post: { actions: "buffer message" }, "message.received": { actions: "buffer incoming message" }, disconnect: { target: "idle" } } }, connected: { entry: ["flush handshake buffer", "flush buffer"], invoke: [{ id: "listen for messages", src: "listen", input: x({ exclude: [O, $] }) }, { id: "listen for heartbeat", src: "listen", input: x({ include: $, responseType: "heartbeat.received" }) }, { id: "listen for disconnect", src: "listen", input: x({ include: A, count: 1, responseType: "disconnect" }) }], on: { request: { actions: "create request" }, post: { actions: "post" }, disconnect: { target: "idle" }, "message.received": { actions: ["send response", "emit received message"] }, "heartbeat.received": { actions: ["send response", "emit heartbeat"] } } } } }), J = (e, t = H()) => {
  const s = createActor(t, { input: e }), n2 = () => {
    s.stop();
  };
  return { actor: s, fetch: (e2, t2) => {
    const n3 = Promise.withResolvers();
    return s.send({ type: "post", data: e2, resolvable: n3, signal: t2?.signal }), n3.promise;
  }, machine: t, on: (e2, t2) => {
    const { unsubscribe: n3 } = s.on(e2, (e3) => {
      t2(e3.message.data);
    });
    return n3;
  }, onStatus: (e2) => {
    const t2 = s.getSnapshot();
    let n3 = "string" == typeof t2.value ? t2.value : Object.keys(t2.value)[0];
    const { unsubscribe: a } = s.subscribe((t3) => {
      const s2 = "string" == typeof t3.value ? t3.value : Object.keys(t3.value)[0];
      n3 !== s2 && (n3 = s2, e2(s2));
    });
    return a;
  }, post: (e2) => {
    s.send({ type: "post", data: e2 });
  }, start: () => (s.start(), n2), stop: n2 };
};
const g = { "handshake/syn": B, "handshake/syn-ack": M, "handshake/ack": j, "channel/response": O, "channel/heartbeat": $, "channel/disconnect": A, "overlay/focus": "visual-editing/focus", "overlay/navigate": "visual-editing/navigate", "overlay/toggle": "visual-editing/toggle", "presentation/toggleOverlay": "presentation/toggle-overlay" }, h = { [B]: "handshake/syn", [M]: "handshake/syn-ack", [j]: "handshake/ack", [O]: "channel/response", [$]: "channel/heartbeat", [A]: "channel/disconnect", "visual-editing/focus": "overlay/focus", "visual-editing/navigate": "overlay/navigate", "visual-editing/toggle": "overlay/toggle", "presentation/toggle-overlay": "presentation/toggleOverlay" }, d = (e) => {
  const { data: t } = e;
  return t && "object" == typeof t && "domain" in t && "type" in t && "from" in t && "to" in t && ("sanity/channels" === t.domain && (t.domain = I), "overlays" === t.to && (t.to = "visual-editing"), "overlays" === t.from && (t.from = "visual-editing"), t.type = g[t.type] ?? t.type), e;
}, y = ({ context: e }, t) => {
  const { sources: n2, targetOrigin: o } = e, r = ((i = t.message).domain === I && (i.domain = "sanity/channels"), "visual-editing" === i.to && (i.to = "overlays"), "visual-editing" === i.from && (i.from = "overlays"), i.type = h[i.type] ?? i.type, "channel/response" === i.type && i.responseTo && !i.data && (i.data = { responseTo: i.responseTo }), i);
  var i;
  n2.forEach((e2) => {
    e2.postMessage(r, { targetOrigin: o });
  });
}, u = () => ({ listen: E(d), requestMachine: D().provide({ actions: { "send message": y } }) });
function n(n2) {
  const { client: i, setFetcher: c, onConnect: p, onDisconnect: d2 } = n2;
  if (!(i && i instanceof SanityClient)) throw new Error(`Expected \`client\` to be an instance of SanityClient or SanityStegaClient: ${JSON.stringify(i)}`);
  const { projectId: u$1, dataset: l } = i.config(), v = U("previewDrafts"), f = U(false), y2 = /* @__PURE__ */ new Map(), g2 = J({ name: "loaders", connectTo: "presentation" }, H().provide({ actors: u() }));
  let m;
  g2.onStatus((e) => {
    "connected" === e ? f.set(true) : "disconnected" === e && f.set(false);
  }), g2.on("loader/perspective", (e) => {
    if (e.projectId === u$1 && e.dataset === l) {
      if ("published" !== e.perspective && "previewDrafts" !== e.perspective) throw new Error(`Unsupported perspective: ${JSON.stringify(e.perspective)}`);
      v.set(e.perspective), w();
    }
  }), g2.on("loader/query-change", (e) => {
    if (e.projectId === u$1 && e.dataset === l) {
      const { perspective: t, query: s, params: o } = e;
      void 0 !== e.result && void 0 !== e.resultSourceMap && i.config().stega.enabled ? y2.set(JSON.stringify({ perspective: t, query: s, params: o }), { ...e, result: stegaEncodeSourceMap(e.result, e.resultSourceMap, i.config().stega) }) : y2.set(JSON.stringify({ perspective: t, query: s, params: o }), e), w();
    }
  });
  const S = f.listen((e) => {
    e ? (m = c({ hydrate: (e2, t, r) => {
      const s = r?.perspective || v.get(), o = JSON.stringify({ perspective: s, query: e2, params: t }), a = y2.get(o);
      return void 0 !== a?.result && void 0 !== a?.resultSourceMap ? { loading: false, error: void 0, data: a.result, sourceMap: a.resultSourceMap, perspective: s } : { loading: true === f.value && void 0 === r?.data || void 0 === r?.sourceMap, error: void 0, data: r?.data, sourceMap: r?.sourceMap, perspective: r?.perspective || "published" };
    }, fetch: (e2, t, r, s) => {
      try {
        const o = M2(e2, t, r);
        if (s.signal.addEventListener("abort", () => {
          o(), w();
        }, { once: true }), w(), r.setKey("error", void 0), s.signal.aborted) return;
      } catch (e3) {
        r.setKey("error", e3), r.setKey("loading", false);
      }
    } }), p?.()) : (m?.(), d2?.());
  }), h2 = /* @__PURE__ */ new Set(), M2 = (e, t, r) => {
    const s = { query: e, params: t, $fetch: r };
    h2.add(s), q();
    const o = setInterval(() => q(true), 1e3);
    return () => {
      clearInterval(o), h2.delete(s), q();
    };
  }, q = (e) => {
    if (!g2) throw new Error("No connection");
    const t = v.get();
    for (const { query: r, params: s, $fetch: o } of h2) g2.post({ type: "loader/query-listen", data: { projectId: u$1, dataset: l, perspective: t, query: r, params: s, heartbeat: 1e3 } }), !e && true === f.value && o.setKey("loading", true), o.setKey("perspective", t);
  };
  function w() {
    const e = v.get(), t = [];
    for (const { query: r, params: s, $fetch: o } of h2) {
      const a = JSON.stringify({ perspective: e, query: r, params: s }), n3 = y2.get(a);
      n3 && (o.set({ data: n3.result, error: void 0, loading: false, perspective: e, sourceMap: n3.resultSourceMap }), t.push(...n3.resultSourceMap?.documents ?? []));
    }
    g2.post({ type: "loader/documents", data: { projectId: u$1, dataset: l, perspective: e, documents: t } });
  }
  const b = g2.start();
  return () => {
    m?.(), S(), b();
  };
}
export {
  n as enableLiveMode
};
