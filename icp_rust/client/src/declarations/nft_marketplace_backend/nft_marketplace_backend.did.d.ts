import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface NFT {
  'token_id' : bigint,
  'owner' : string,
  'metadata_url' : string,
  'price' : [] | [bigint],
}
export interface _SERVICE {
  'buy' : ActorMethod<[bigint], undefined>,
  'get_all_nfts' : ActorMethod<[], Array<NFT>>,
  'init' : ActorMethod<[], undefined>,
  'mint_and_list' : ActorMethod<[string, [] | [bigint]], bigint>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
