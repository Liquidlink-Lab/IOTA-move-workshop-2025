/*
/// Module: example1
module example1::example1;
*/

// For Move coding conventions, see
// https://docs.iota.org/developer/iota-101/move-overview/conventions


module example1::objectexample;

use iota::object::{Self as object, UID, new as object_new};
use iota::transfer::{Self as transfer, public_transfer};
use iota::tx_context::{Self as tx_context, TxContext};

const E_SLOT_OCCUPIED: u64 = 101;

public struct Watch has key, store {
    id: UID,
    value: u64,
}

public struct Man has key, store {
    id: UID,
    number: u64,
    watch: Option<Watch>,
}

public entry fun get_a_man(ctx: &mut TxContext) {
    let new_man = Man {
        id: object::new(ctx),
        number: 33,
        watch: option::none(),
    };
    transfer::public_transfer(new_man, tx_context::sender(ctx));
}

public entry fun get_a_watch(ctx: &mut TxContext) {
    let new_watch = Watch {
        id: object::new(ctx),
        value: 99,
    };
    transfer::public_transfer(new_watch, tx_context::sender(ctx));
}

public entry fun wear_a_watch(mut man: Man, watch: Watch, ctx: &mut TxContext) {
    let sender = tx_context::sender(ctx);

    assert!(option::is_none(&man.watch), E_SLOT_OCCUPIED);

    option::fill(&mut man.watch, watch);

    transfer::public_transfer(man, sender);
}

public entry fun take_off_watch(mut man: Man, ctx: &mut TxContext) {
    let sender = tx_context::sender(ctx);

    assert!(option::is_some(&man.watch), E_SLOT_OCCUPIED);

    let watch = option::extract(&mut man.watch);

    transfer::public_transfer(man, sender);

    transfer::public_transfer(watch, sender);
}

public entry fun take_off_watch_darkmod(mut man: Man, ctx: &mut TxContext) {
    let sender = tx_context::sender(ctx);

    assert!(option::is_some(&man.watch), E_SLOT_OCCUPIED);

    let Man{
        id:men_id,
        number:_,
        watch: mut the_watch,
    } = man;

    object::delete(men_id);

    let watch = option::extract(&mut the_watch);

    transfer::public_transfer(watch, sender);

    option::destroy_none(the_watch);
}
