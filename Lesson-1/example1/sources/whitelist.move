/*
/// Module: example1
module example1::example1;
*/
module example1::whitelist;

use iota::object::{Self as object, UID};
use iota::transfer::{Self, public_share_object};
use iota::tx_context::{Self as tx_context, TxContext};
use iota::vec_map::{Self as vec_map, VecMap};
use std::string::{Self, String};

public struct Whitelist has key, store {
    id: UID,
    state: bool,
    admin: address,
    allowed: VecMap<address, String>,
}

fun init(ctx: &mut TxContext) {
    let sender = tx_context::sender(ctx);
    let wl = Whitelist {
        id: object::new(ctx),
        state: true,
        admin: sender,
        allowed: vec_map::empty<address, String>(),
    };
    public_share_object(wl);
}

public entry fun add_to_whitelist(
    wl: &mut Whitelist,
    name: vector<u8>,
    ctx: &mut TxContext,
) {
    let sender = tx_context::sender(ctx);
    assert(wl.state, 666);
    let name_str = string::utf8(name);
    vec_map::insert(&mut wl.allowed, sender, name_str);
}

public entry fun freeze_state(wl: &mut Whitelist, state: bool, ctx: &mut TxContext) {
    let sender = tx_context::sender(ctx);
    assert(wl.admin == sender, 999);

    wl.state = state;
}

public fun is_whitelisted(wl: &Whitelist, user: address): bool {
    vec_map::contains(&wl.allowed, &user)
}
