
module example1::objectexample1;

use iota::object::{Self as object, UID, new as object_new};
use iota::transfer::{Self as transfer, public_transfer};
use iota::tx_context::{Self as tx_context, TxContext};

public struct Ball has key, store {
    id: UID,
    color: u64,
}

public struct Box has key {
    id: UID,
    ball: Ball,
}

public entry fun get_a_ball(ctx: &mut TxContext) {
    let color_of_the_ball: u64 = 13;

    let ball = Ball {
        id: object_new(ctx),cd 
        color: color_of_the_ball,
    };

    transfer::public_transfer(ball, tx_context::sender(ctx));
}

public entry fun put_a_ball_in_the_box(the_ball: Ball, ctx: &mut TxContext) {
    let box = Box {
        id: object_new(ctx),
        ball: the_ball,
    };

    transfer::transfer(box, tx_context::sender(ctx));
}
