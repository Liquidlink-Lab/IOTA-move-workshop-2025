/*
/// Module: vecmaps
module vecmaps::vecmaps;
*/

// For Move coding conventions, see
// https://docs.iota.org/developer/iota-101/move-overview/conventions


/*
/// Module: vec
module vec::vec;
*/

// For Move coding conventions, see
// https://docs.iota.org/developer/iota-101/move-overview/conventions

module vecmaps::vecmaps;

use iota::vec_map::{Self as vec_map, VecMap, empty as vec_map_empty};
use iota::object::{UID, new as object_new, ID};
use iota::tx_context::{Self, TxContext};
use iota::transfer::{Self, public_share_object, transfer};


public struct List has key, store {
    id: UID,
    ranking: VecMap<address, u64>,
}

fun init(ctx: &mut TxContext) {
    let list = List {
        id: object_new(ctx),
        ranking:vec_map_empty(),
    };

    public_share_object(list);
}


public entry fun change_data(list: &mut List,user:address ,values: u64,ctx: &mut TxContext) {

    if (vec_map::contains(&list.ranking, &user)) {
        let current_score_ref = vec_map::get_mut(&mut list.ranking, &user);
        *current_score_ref = *current_score_ref * values;
    } else {
        vec_map::insert(&mut list.ranking, user, 1 *  values);
    };
}