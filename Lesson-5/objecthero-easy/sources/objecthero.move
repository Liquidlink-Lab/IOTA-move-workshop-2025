module objecthero::hero;

use iota::address;
use iota::balance::{Self, Balance};
use iota::clock::{Self, Clock};
use iota::object::{UID, new as object_new, ID};
use iota::random::{Self, Random};
use iota::transfer::{Self, public_share_object, transfer};
use iota::tx_context::{Self, TxContext, epoch};
use iota::vec_map::{Self as vec_map, VecMap, empty as vec_map_empty};

const EAttackLimit: u64 = 0;
const EWrongPrice: u64 = 1;

public struct Gem has key, store {
    id: UID,
    power: u64,
}

public struct Sword has key, store {
    id: UID,
    power: u64,
    gem: Option<Gem>,
}

public struct Shield has key, store {
    id: UID,
    power: u64,
    gem: Option<Gem>,
}

public struct Hero has key {
    id: UID,
    proficiency: u64,
    power: u64,
    sword: Option<Sword>,
    shield: Option<Shield>,
    latest_attack_epoch: u64,
    attack_times: u8,
}

public struct FightList has key, store {
    id: UID,
    ranking: VecMap<address, u64>,
}

const MINT_HERO_PRICE: u64 = 50_000_000_000;
const MINT_EQUIPMENT_PRICE: u64 = 20_000_000_000;
const MINT_HERO_DECIMALS: u64 = 1_000_000_000;

fun init(ctx: &mut TxContext) {
    let list = FightList {
        id: object_new(ctx),
        ranking: vec_map_empty(),
    };

    public_share_object(list);
}

fun random_value(r: &Random, low: u64, high: u64, ctx: &mut TxContext): u64 {
    let mut generator = random::new_generator(r, ctx);
    let random_num = random::generate_u64_in_range(&mut generator, low, high);
    random_num
}

fun intenal_sword(power: u64, ctx: &mut TxContext): Sword {
    Sword {
        id: object::new(ctx),
        power: power,
        gem: option::none(),
    }
}

fun intenal_shield(power: u64, ctx: &mut TxContext): Shield {
    Shield {
        id: object::new(ctx),
        power: power,
        gem: option::none(),
    }
}

public entry fun create_sword(r: &Random, ctx: &mut TxContext) {
    let power = random_value(r, 1, 15, ctx);
    let sword = intenal_sword(power, ctx);

    transfer::public_transfer(sword, tx_context::sender(ctx));
}

public entry fun create_shield(r: &Random, ctx: &mut TxContext) {
    let power = random_value(r, 2, 6, ctx);
    let sword = intenal_shield(power, ctx);

    transfer::public_transfer(sword, tx_context::sender(ctx));
}

public fun equip_shield(hero: &mut Hero, shield: Shield, ctx: &mut TxContext) {
    option::fill(&mut hero.shield, shield);
}

public fun equip_sword(hero: &mut Hero, sword: Sword, ctx: &mut TxContext) {
    option::fill(&mut hero.sword, sword);
}

public entry fun create_hero(r: &Random, ctx: &mut TxContext) {
    let power = random_value(r, 5, 8, ctx);
    let newproficiency = random_value(r, 120, 200, ctx);

    let person = Hero {
        id: object::new(ctx),
        proficiency: newproficiency,
        power: power,
        sword: option::none(),
        shield: option::none(),
        attack_times: 0,
        latest_attack_epoch: 0,
    };
    transfer::transfer(person, tx_context::sender(ctx));
}

public entry fun unwrapItems(mut hero: Hero, ctx: &mut TxContext) {
    let sender = tx_context::sender(ctx);

    if (option::is_some(&hero.sword)) {
        let sword_object = option::extract(&mut hero.sword);
        transfer::transfer(sword_object, sender);
    };

    if (option::is_some(&hero.shield)) {
        let shield_object = option::extract(&mut hero.shield);
        transfer::transfer(shield_object, sender);
    };

    transfer::transfer(hero, sender);
}

public entry fun transfer_hero(hero: Hero, ctx: &mut TxContext) {
    transfer::transfer(hero, ctx.sender())
}
