export const idlFactory = ({ IDL }) => {
  const NFT = IDL.Record({
    'token_id' : IDL.Nat64,
    'owner' : IDL.Text,
    'metadata_url' : IDL.Text,
    'price' : IDL.Opt(IDL.Nat64),
  });
  return IDL.Service({
    'buy' : IDL.Func([IDL.Nat64], [], []),
    'get_all_nfts' : IDL.Func([], [IDL.Vec(NFT)], []),
    'init' : IDL.Func([], [], []),
    'mint_and_list' : IDL.Func([IDL.Text, IDL.Opt(IDL.Nat64)], [IDL.Nat64], []),
  });
};
export const init = ({ IDL }) => { return []; };
