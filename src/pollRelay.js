import {
  relayInit,
  generatePrivateKey,
  getPublicKey,
  getEventHash,
  signEvent,
} from "nostr-tools";
import bots from "../bots.js";
import { parseEvent } from "./etl/parseEvent.js";
import 'websocket-polyfill'

let lastFetch = 0;

const botPubKeys = bots.map((bot) => bot.pk);

export async function pollRelay(lastFetchedEvent) {
  return new Promise(async (resolve) =>{
    const events = []
    const relay = relayInit("wss://nostr.btc-library.com");
    relay.on("connect", () => {
      console.log(`connected to ${relay.url}`);
    });
    relay.on("error", () => {
      console.log(`failed to connect to ${relay.url}`);
    });
  
    await relay.connect();
    console.log(lastFetchedEvent)
    // let's query for an event that exists
    let sub = relay.sub([
      {
        authors: [...botPubKeys],
        // limit: 10,
        ...(lastFetchedEvent !== 0 && {since: lastFetchedEvent})
      },
    ]);
    sub.on("event", (event) => {
      // console.log("we got the event we wanted:", event);
      events.push(event)
      // parseEvent(event)
    });
    sub.on("eose", () => {
      sub.unsub();
      relay.close()
      resolve(events)
      }
    );
  })
}
