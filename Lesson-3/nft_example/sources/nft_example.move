module nft_example::nft_example;

use iota::url::{Self, Url};
use std::string;
use iota::event;
use iota::display;

/// An example NFT that can be minted by anybody
public struct TestNFT has key, store {
    id: UID,
    /// Name for the token
    name: string::String,
    /// Description of the token
    description: string::String,
    /// URL for the token
    url: Url,
    // TODO: allow custom attributes
}

public struct NFT_EXAMPLE has drop {}

// ===== Events =====

public struct NFTMinted has copy, drop {
    // The Object ID of the NFT
    object_id: ID,
    // The creator of the NFT
    creator: address,
    // The name of the NFT
    name: string::String,
}

// ===== Public view functions =====

/// Get the NFT's `name`
public fun name(nft: &TestNFT): &string::String {
    &nft.name
}

/// Get the NFT's `description`
public fun description(nft: &TestNFT): &string::String {
    &nft.description
}

/// Get the NFT's `url`
public fun url(nft: &TestNFT): &Url {
    &nft.url
}

// ===== Entrypoints =====

/// Create a new devnet_nft
public fun mint_to_sender(
    name: vector<u8>,
    description: vector<u8>,
    url: vector<u8>,
    ctx: &mut TxContext
) {
    let sender = tx_context::sender(ctx);
    let nft = TestNFT {
        id: object::new(ctx),
        name: string::utf8(name),
        description: string::utf8(description),
        url: url::new_unsafe_from_bytes(url)
    };

    event::emit(NFTMinted {
        object_id: object::id(&nft),
        creator: sender,
        name: nft.name,
    });

    transfer::public_transfer(nft, sender);
}

/// Transfer `nft` to `recipient`
public fun transfer(
    nft: TestNFT, recipient: address, _: &mut TxContext
) {
    transfer::public_transfer(nft, recipient)
}

/// Update the `description` of `nft` to `new_description`
public fun update_description(
    nft: &mut TestNFT,
    new_description: vector<u8>,
    _: &mut TxContext
) {
    nft.description = string::utf8(new_description)
}

/// Permanently delete `nft`
public fun burn(nft: TestNFT, _: &mut TxContext) {
    let TestNFT { id, name: _, description: _, url: _ } = nft;
    object::delete(id)
}

fun init(otw: NFT_EXAMPLE, ctx: &mut TxContext) {
    let publisher = iota::package::claim(otw, ctx);

    let mut display = display::new<TestNFT>(&publisher, ctx);
    display::add(&mut display, string::utf8(b"name"), string::utf8(b"{name}"));
    display::add(&mut display, string::utf8(b"description"), string::utf8(b"{description}"));
    display::add(&mut display, string::utf8(b"image_url"), string::utf8(b"{url}"));
    display::update_version(&mut display);

    transfer::public_transfer(publisher, ctx.sender());
    transfer::public_transfer(display, ctx.sender());
}