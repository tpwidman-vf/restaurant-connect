import {AttributeMap} from "./ConnectAttributeMap";
import {Endpoint} from "./ConnectEndpoint";

export interface ContactData {
  Attributes: AttributeMap;
  Channel: string; // VOICE
  ContactId: string;
  CustomerEndpoint: Endpoint;
  InitialContactId: string;
  InitiationMethod: "INBOUND" | "OUTBOUND" | "TRANSFER" | "CALLBACK" | string;
  InstanceARN: string;
  MediaStreams?: AttributeMap;
  PreviousContactId: string;
  Queue: AttributeMap;
  SystemEndpoint: Endpoint;
}