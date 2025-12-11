type NETWORK = "mainnet" | "testnet" | "localnet" | string;

export type HeroConfig = {
  originPackage?: string;
  package: string;
  gameTreasuryCap?: string;
  fightList?: string;
};

type CONFIG = Record<NETWORK, HeroConfig>;

export const HERO_PRICE = 50_000_000_000;
export const EQUIPMENT_PRICE = 20_000_000_000;
export const HERO_DECIMALS = 1_000_000_000;
export const RANDOM_OBJECT_ID = "0x8";
export const CLOCK_OBJECT_ID = "0x6";

export const OBJECT_HERO: CONFIG = {
  localnet: {
    originPackage:
      "0x796966bf3c64958eda9d69f92d4ab3a23fad2b7a8562933cbd8a092ff2886b77",
    package:
      "0x796966bf3c64958eda9d69f92d4ab3a23fad2b7a8562933cbd8a092ff2886b77",
    gameTreasuryCap:
      "0xb0c1a5ef3273daa55c56d2e4bffebf4652c92172ee32e83bd7f5b6d6991a9474",
    fightList:
      "0x71f300a3c8d8cb6b88fbd6d6767a36e3c74938b762b4fe7f0d8d0cf4e9c52d17",
  },
  testnet: {
    originPackage:
      "0xfdb0c3a3cb644df65a4d549be8e870f88e7f2a145c78982d573ee98b8b077487",
    package:
      "0xfdb0c3a3cb644df65a4d549be8e870f88e7f2a145c78982d573ee98b8b077487",
    gameTreasuryCap:
      "0xa68b556d3ce2988bdd034ecaffef46154598575c25ab3f2f4a20e08e010742dd",
    fightList:
      "0xbd9a10bb3be28089929beaeff7cea7b65269fd1da6d2c62850a48a7bbdbd4b7c",
  },
};
