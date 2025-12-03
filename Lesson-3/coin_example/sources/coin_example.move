module coin_example::coin_example;

use iota::coin::{Self, TreasuryCap, Coin};
use iota::url;
use iota::transfer::{Self, transfer};

public struct COIN_EXAMPLE has drop {}

fun init(witness: COIN_EXAMPLE, ctx: &mut TxContext) {
    let (mut treasury_cap, coin_metadata) = coin::create_currency(
        witness,
        9,
        b"test",
        b"test",
        b"test",
        option::some(url::new_unsafe_from_bytes(b"https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.svgrepo.com%2Fsvg%2F327405%2Flogo-usd&psig=AOvVaw2A4ktX0YSLyC0Ntnfhe6Vh&ust=1761913741050000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCOC3osuPzJADFQAAAAAdAAAAABAE")),
        ctx
    );

    transfer::public_freeze_object(coin_metadata);
    transfer::public_transfer(treasury_cap, ctx.sender());
}

public fun mint_coin<T>(
    treasury_cap: &mut TreasuryCap<T>,
    amount: u64,
    ctx: &mut TxContext
) {
    let coin = coin::mint<T>(treasury_cap, amount, ctx);
    transfer::public_transfer(coin, tx_context::sender(ctx));
}