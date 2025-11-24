/*
/// Module: example1
module example1::example1;
*/
module example1::example2;

use iota::object::{Self as object, UID};
use iota::tx_context::{Self as tx_context, TxContext};


public struct Test has key, store {
    id: UID,
    state: u64,
}


public entry fun get_a_object(number:u64,ctx: &mut TxContext){
    let obj = Test{
        id:object::new(ctx),
        state:number,
    };
   transfer::transfer(obj, tx_context::sender(ctx));
}
