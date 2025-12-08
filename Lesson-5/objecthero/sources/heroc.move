module objecthero::heroc_token;

use std::option;
use iota::coin::{Self, Coin, TreasuryCap};
use iota::transfer;
use iota::tx_context::{Self, TxContext};

public struct HEROC_TOKEN has drop {}

fun init(witness:HEROC_TOKEN,ctx: &mut TxContext) {
    let sender = tx_context::sender(ctx);

    let (mut treasury_cap, metadata) = coin::create_currency<HEROC_TOKEN>(
        witness,
        9,
        b"HEROC",
        b"Hero Reward Token",
        b"Design by iota workshop",
        option::none(),
        ctx,
    );

    let coin = coin::mint(&mut treasury_cap, 5000000000000, ctx);
    transfer::public_transfer(coin, sender);

    transfer::public_transfer(treasury_cap,sender);
    transfer::public_freeze_object(metadata);
}


public(package) fun mint(
    cap: &mut TreasuryCap<HEROC_TOKEN>,
    amount: u64,
    recipient: address,
    ctx: &mut TxContext,
) {
    let coin = coin::mint(cap, amount, ctx);
    transfer::public_transfer(coin, recipient);
}


public(package) fun burn(cap: &mut TreasuryCap<HEROC_TOKEN>, coin: Coin<HEROC_TOKEN>) {
    coin::burn(cap, coin);
}
