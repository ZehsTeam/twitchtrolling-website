// --- ENEMY CARD IMAGES ---
import RandomEnemy from '$lib/assets/effects/random.png';
import AggroBeacon from '$lib/assets/empty.png';
import Animal from '$lib/assets/effects/enemies/Animal.png';
import ApexPredator from '$lib/assets/effects/enemies/Apex Predator.png';
import Banger from '$lib/assets/effects/enemies/Banger.png';
import Bowtie from '$lib/assets/effects/enemies/Bowtie.png';
import Chef from '$lib/assets/effects/enemies/Chef.png';
import Clown from '$lib/assets/effects/enemies/Clown.png';
import Driller from '$lib/assets/effects/enemies/Driller.png';
import FreddyFazbear from '$lib/assets/effects/enemies/Freddy Fazbear.png';
import Gnome from '$lib/assets/effects/enemies/Gnome.png';
import Gusher from '$lib/assets/effects/enemies/Gusher.png';
import Headman from '$lib/assets/effects/enemies/Headman.png';
import Hidden from '$lib/assets/effects/enemies/Hidden.png';
import Huntsman from '$lib/assets/effects/enemies/Huntsman.png';
import Mentalist from '$lib/assets/effects/enemies/Mentalist.png';
import Peeper from '$lib/assets/effects/enemies/Peeper.png';
import Reaper from '$lib/assets/effects/enemies/Reaper.png';
import Robe from '$lib/assets/effects/enemies/Robe.png';
import Rugrat from '$lib/assets/effects/enemies/Rugrat.png';
import ShadowChild from '$lib/assets/effects/enemies/Shadow Child.png';
import Spewer from '$lib/assets/effects/enemies/Spewer.png';
import Trudge from '$lib/assets/effects/enemies/Trudge.png';
import Upscream from '$lib/assets/effects/enemies/Upscream.png';
import Zombie from '$lib/assets/effects/enemies/Zombie.png';
import Puppet from '$lib/assets/effects/enemies/Puppet.png';
import Voodoo from '$lib/assets/effects/enemies/Voodoo.png';
import WeepingAngel from '$lib/assets/effects/enemies/Weeping Angel.png';
import Roaster from '$lib/assets/effects/enemies/Roaster.png';
import LostDroid from '$lib/assets/effects/enemies/Lost droid.gif';
import Soldier from '$lib/assets/effects/enemies/Soldier.png';
import LostDestroyer from '$lib/assets/effects/enemies/Lost Destroyer.gif';
import Tick from '$lib/assets/effects/enemies/Tick.png';
import BirthdayBoy from '$lib/assets/effects/enemies/Birthday Boy.png';
import Elsa from '$lib/assets/effects/enemies/Elsa.png';
import Bella from '$lib/assets/effects/enemies/Bella.png';
import Gambit from '$lib/assets/effects/enemies/Gambit.png';
import HeartHugger from '$lib/assets/effects/enemies/Heart Hugger.png';
import Headgrab from '$lib/assets/effects/enemies/Headgrab.png';
import Oogly from '$lib/assets/effects/enemies/Oogly.png';
import Loom from '$lib/assets/effects/enemies/Loom.png';
import CleanupCrew from '$lib/assets/effects/enemies/Cleanup Crew.png';

// --- EVENT CARD IMAGES ---
import RandomEvent from '$lib/assets/effects/random.png';
import AnimalCrate from '$lib/assets/effects/events/Animal Crate.png';
import Bottle from '$lib/assets/effects/events/Bottle.png';
import ChompBook from '$lib/assets/effects/events/Chomp Book.png';
import ClownEvent from '$lib/assets/effects/events/Clown.png';
import DuctTapedGrenades from '$lib/assets/effects/events/Duct Taped Grenades.png';
import DumgolfsStaff from '$lib/assets/effects/events/Wizard Dumgolfs Staff.png';
import Fan from '$lib/assets/effects/events/Fan.png';
import Flamethrower from '$lib/assets/effects/events/Arctic Flamethrower.png';
import Frog from '$lib/assets/effects/events/Frog.png';
import IceSaw from '$lib/assets/effects/events/Ice Saw.png';
import Minefield from '$lib/assets/effects/events/Explosive Mine.png';
import PlayerSpeed from '$lib/assets/effects/events/Sprint Speed Upgrade.png';
import PropaneTank from '$lib/assets/effects/events/Arctic Propane Tank.png';
import Psycho from '$lib/assets/effects/events/Psycho.png';
import RollDrone from '$lib/assets/effects/events/Roll Drone.png';
import RubberDuck from '$lib/assets/effects/events/Rubber Duck.png';
import ZeroGravityOrb from '$lib/assets/effects/events/Zero Gravity Orb.png';

// --- IMAGE MAPS ---
export const enemyImageMap: Record<string, string> = {
	'Random Enemy': RandomEnemy,
	Animal: Animal,
	'Apex Predator': ApexPredator,
	Banger: Banger,
	Bowtie: Bowtie,
	Chef: Chef,
	Clown: Clown,
	Driller: Driller,
	'Freddy Fazbear': FreddyFazbear,
	Gnome: Gnome,
	Gusher: Gusher,
	Headman: Headman,
	Hidden: Hidden,
	Huntsman: Huntsman,
	Mentalist: Mentalist,
	Peeper: Peeper,
	Reaper: Reaper,
	Robe: Robe,
	Rugrat: Rugrat,
	'Shadow Child': ShadowChild,
	Spewer: Spewer,
	Trudge: Trudge,
	Upscream: Upscream,
	Zombie: Zombie,
	Puppet: Puppet,
	Voodoo: Voodoo,
	'Weeping Angel': WeepingAngel,
	Roaster: Roaster,
	'Lost droid': LostDroid,
	Soldier: Soldier,
	'Lost Destroyer': LostDestroyer,
	Tick: Tick,
	'Birthday Boy': BirthdayBoy,
	Elsa: Elsa,
	Bella: Bella,
	Gambit: Gambit,
	'Heart Hugger': HeartHugger,
	Headgrab: Headgrab,
	Oogly: Oogly,
	Loom: Loom,
	'Cleanup Crew': CleanupCrew
};

export const eventImageMap: Record<string, string> = {
	'Random Event': RandomEvent,
	'Aggro Beacon': AggroBeacon,
	'Animal Crate': AnimalCrate,
	Bottle: Bottle,
	'Chomp Book': ChompBook,
	Clown: ClownEvent,
	'Duct Taped Grenades': DuctTapedGrenades,
	'Dumgolfs Staff': DumgolfsStaff,
	Fan: Fan,
	Flamethrower: Flamethrower,
	Frog: Frog,
	'Ice Saw': IceSaw,
	Minefield: Minefield,
	'Player Speed': PlayerSpeed,
	'Propane Tank': PropaneTank,
	Psycho: Psycho,
	'Roll Drone': RollDrone,
	'Rubber Duck': RubberDuck,
	'Zero Gravity Orb': ZeroGravityOrb
};
