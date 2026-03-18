using System;
using System.Collections.Generic;
using System.Linq;
using Common.Data;
using Common.Resources;
using CommonDataTypes;
using Microsoft.Xna.Framework;
using TheraEngine.Collections;
using TheraEngine.Helpers;

namespace Common.Game;

public static class NpcShipHelper
{
	internal static readonly string[] traderNames = new string[30]
	{
		"Golden Voyage", "Silver Gull", "Emerald Horizon", "Prosperity", "Fortune's Favor", "Calm Waters", "Sunlit Crest", "Merchant's Grace", "Star of the Sea", "Velvet Wind",
		"Golden Harbor", "Pearl Voyager", "Sea Prosper", "Trade Winds", "Velvet Horizon", "Silver Crest", "Starlight Merchant", "Azure Tide", "Sunrise Gale", "Ocean's Bounty",
		"Majestic Wave", "Fortunate Sail", "Amber Dawn", "Seafarer's Luck", "Golden Bale", "Sapphire Route", "Harbor Star", "Serene Mariner", "Merchant's Jewel", "Windborne Fortune"
	};

	internal static readonly string[] pirateNamesShort = new string[40]
	{
		"Black Raven", "Sea Serpent", "Iron Whale", "Crimson Tide", "Silent Hunter", "Golden Fang", "Nightshade", "Storm Chaser", "Sea Wolf", "Shadow Gale",
		"Bloodfin", "Dark Fortune", "Siren's Call", "Wave Breaker", "Tempest", "Widowmaker", "Savage Gull", "Ironclad", "Ghost Sails", "Black Moon",
		"Blazing Star", "Howling Gale", "Silver Pike", "Storm Crow", "Drake's Fury", "Red Corsair", "Steel Tempest", "Harbinger", "Phantom Tide", "Lost Horizon",
		"Dark Mariner", "Rogue Wave", "Thunder Crest", "Venom Fang", "Scarlet Vulture", "Black Reaver", "Leviathan", "Storm Reaver", "Burning Horizon", "Grim Tide"
	};

	internal static readonly string[] pirateNamesLong = new string[43]
	{
		"The Munlochy", "The Pillager", "The New Pearl", "The Last Privateer", "The Rising Plunder", "The Silent Raider", "The Fortune Sea", "Daughter of Storm", "The Howling Captain", "The Bloody Gold",
		"The Bloody Dagger", "The Executioner", "The Broken Galley", "The Deceit", "The Lust Princess", "The Hateful Wolf", "The Horrid Shark", "The Murderous Tide", "The Black Grail", "The Hellscream",
		"Sanguine Flag", "Black Snake Raiders", "Gilded Cannon", "White Squid", "Silver Sword", "Hired Swords", "Salty Swabbers", "Dread Buccaneers", "Sanguine Bandits", "Siren's Song",
		"Tortuga Raiders", "Thunder Buccaneers", "Crazy Eyes", "Golden Pillagers", "Corsa Noir", "Seven Seas", "Cursed Doubloon", "Hollow Plunderers", "Silver Wave Pirates", "Black Sun",
		"Golden Tooth", "Silver Moon", "Black Diamond"
	};

	internal static readonly string[] ancientNames = new string[32]
	{
		"Heron", "Kyros", "Linus", "Nikias", "Plato", "Thales", "Aeropos", "Aftonio", "Arye", "Chares",
		"Cleofas", "Epaphras", "Hermie", "Isocrates", "Kleitos", "Meliton", "Platon", "Priam", "Taras", "Zenon",
		"Zopyros", "Ceas", "Didius", "Erbin", "Eleon", "Gessius", "Idaios", "Kir", "Mus", "Naevius",
		"Orpheus", "Varro"
	};

	internal static readonly string[] horrorNames = new string[40]
	{
		"Black Abyss", "Bloodwake", "Nightmare", "Grim Reaper", "Ghost Fang", "Dark Widow", "Shadow Maw", "Doomtide", "Silent Curse", "Bone Raven",
		"Death Whisper", "Soul Reaver", "Black Howl", "Crimson Fog", "Phantom Gale", "Rotfang", "Forsaken", "Voidstalker", "Dead Tide", "Haunted Wave",
		"Wraith", "Specter", "Dagger Wind", "Mourning Star", "Hex", "Gallows", "Plague Wind", "Shrouded Doom", "Black Omen", "Duskfall",
		"Blood Vow", "Dark Veil", "Death Knell", "Ravenous", "Silent Wraith", "Black Fang", "Chill Tide", "Dire Gale", "Twilight Reaper", "Doomsayer"
	};

	internal static readonly string[] religiousNames = new string[30]
	{
		"Last Judgement", "Doom Ark", "Holy Wrath", "Prophet's Voice", "Seraphim's Wing", "Requiem", "Divine Fury", "Ashen Covenant", "Pale Prophet", "Eclipse of Faith",
		"Sinner's Bane", "Final Psalm", "Wrathful Angel", "Penitent Flame", "Heaven's Scourge", "Seal of the End", "Omen of Fire", "Gospel of Doom", "Ark of Revelation", "The Redeemer",
		"Sword of Faith", "Chalice of Woe", "Exodus", "Purgatory's Wake", "Lamb's Sacrifice", "Covenant of Ash", "The Anointed", "Martyrs Cry", "Herald of Ruin", "Veil of the End"
	};

	internal static readonly string[] legendNames = new string[20]
	{
		"The Unseen", "Relentless", "The Untamed", "Unyielding", "Phantom Pursuer", "Everwatching", "Stormbringer", "The Dauntless", "Silent Avenger", "Distant Thunder",
		"The Uncatchable", "Eternal Hunter", "Farsight", "The Reckoner", "Ghost of the Deep", "Windspeaker", "The Unforgiving", "Piercing Gaze", "The Indomitable", "Iron Will"
	};

	private static Tlist<int> mortarShipLimit = new Tlist<int>();

	internal static Tlist<int> allShipLimit = new Tlist<int>();

	private static readonly ShipBonusEffect[] randomUpgrades = new ShipBonusEffect[6]
	{
		ShipBonusEffect.PReduceFireAreaDamage,
		ShipBonusEffect.PSailProtection,
		ShipBonusEffect.PReduceDamageToNose,
		ShipBonusEffect.PAddCollisionDamage,
		ShipBonusEffect.BMoreFireAreaAndBurning,
		ShipBonusEffect.PCannonBallsSpeed
	};

	private static readonly ShipBonusEffect[] randomUpgradesPassingMap = new ShipBonusEffect[9]
	{
		ShipBonusEffect.PReduceFireAreaDamage,
		ShipBonusEffect.PSailProtection,
		ShipBonusEffect.PReduceDamageToNose,
		ShipBonusEffect.PAddCollisionDamage,
		ShipBonusEffect.MHealth,
		ShipBonusEffect.MArmor,
		ShipBonusEffect.PFrontAndBackCannonsAddDamage,
		ShipBonusEffect.BMoreFireAreaAndBurning,
		ShipBonusEffect.PReduceReceivesMortarDamage
	};

	public static int GetMaxCrewCount(float _007B3807_007D, int _007B3808_007D, NpcType _007B3809_007D)
	{
		float num = Math.Max(500f, _007B3807_007D) / 50f;
		if (num > 40f)
		{
			num = 40f + (num - 40f) / 2f;
		}
		float num2 = num + 3f + (float)HashHelper.greaterInt(_007B3808_007D, 5);
		num2 = ((_007B3809_007D != NpcType.Empire_Legendary2l) ? (num2 * 0.92f) : (num2 * 0.8f));
		return (int)Math.Ceiling(num2 * 4f);
	}

	public static float GetNpcCannonAngle(float _007B3810_007D, int _007B3811_007D, NpcType _007B3812_007D)
	{
		float num = ((_007B3810_007D > 150f) ? MathHelper.ToRadians(10f) : ((_007B3810_007D > 130f) ? MathHelper.ToRadians(15f) : MathHelper.ToRadians(20f)));
		return num + (MathHelper.ToRadians(10f) * HashHelper.greater(_007B3811_007D) + MathHelper.ToRadians(new NpcClassDecorator(_007B3812_007D).ReinforceCanonAngle));
	}

	private static float MaxOrNegativeUpgradeAmount(bool _007B3813_007D, PlayerShipInfo _007B3814_007D, ShipBonusEffect _007B3815_007D)
	{
		float num = 0f;
		foreach (ShipUpgradeInfo item in (IEnumerable<ShipUpgradeInfo>)Gameplay.ShipUpgradesInfo)
		{
			foreach (ShipBonus effect in item.GetEffects(_007B3814_007D))
			{
				if (effect.Type == _007B3815_007D)
				{
					num = (_007B3813_007D ? Math.Max(num, effect.Value) : Math.Min(num, effect.Value));
				}
			}
		}
		if (_007B3815_007D == ShipBonusEffect.MHealth)
		{
			foreach (ShipUpgradeInfo item2 in (IEnumerable<ShipUpgradeInfo>)Gameplay.ShipUpgradesInfo)
			{
				foreach (ShipBonus effect2 in item2.GetEffects(_007B3814_007D))
				{
					if (effect2.Type == ShipBonusEffect.PHealth)
					{
						num = (_007B3813_007D ? Math.Max(num, effect2.Value * _007B3814_007D.PatHealth / 100f) : Math.Min(num, effect2.Value * _007B3814_007D.PatHealth / 100f));
					}
				}
			}
		}
		if (_007B3815_007D == ShipBonusEffect.MSpeed)
		{
			foreach (ShipUpgradeInfo item3 in (IEnumerable<ShipUpgradeInfo>)Gameplay.ShipUpgradesInfo)
			{
				foreach (ShipBonus effect3 in item3.GetEffects(_007B3814_007D))
				{
					if (effect3.Type == ShipBonusEffect.PSpeed)
					{
						num = (_007B3813_007D ? Math.Max(num, effect3.Value * _007B3814_007D.PatSpeed / 100f) : Math.Min(num, effect3.Value * _007B3814_007D.PatSpeed / 100f));
					}
				}
			}
		}
		return new StaticEffectsCalculator(new ShipBonus(_007B3815_007D, num))[_007B3815_007D];
	}

	private static CannonGameInfo WeaponHelper(CannonClass _007B3816_007D, float _007B3817_007D)
	{
		CannonGameInfo[] array = (from _007B3856_007D in Gameplay.CannonsGameInfo
			where _007B3856_007D.Class == _007B3816_007D
			orderby _007B3856_007D.CostAsGold.Value
			select _007B3856_007D).ToArray();
		int val = (int)Math.Round(_007B3817_007D * (float)array.Length);
		val = Math.Min(val, array.Length - 1);
		return array[Math.Max(1, val)];
	}

	private static PlayerShipInfo? GetPlayerShipInfo(Sequence _007B3818_007D, int _007B3819_007D, bool _007B3820_007D, bool _007B3821_007D, bool _007B3822_007D, bool _007B3823_007D, FractionID? _007B3824_007D = null, bool _007B3825_007D = false, params ShipClass[] _007B3826_007D)
	{
		Tlist<PlayerShipInfo> tlist = new Tlist<PlayerShipInfo>();
		int num = ((!_007B3822_007D) ? 2 : 0);
		int num2 = ((!_007B3822_007D) ? ((_007B3826_007D.Contains(ShipClass.Battleship) || _007B3826_007D.Contains(ShipClass.Hardship)) ? 1 : 2) : 0);
		if (_007B3819_007D == 0 || _007B3819_007D == 1)
		{
			num2 = Math.Min(num2, 1);
		}
		for (int i = _007B3819_007D - num; i <= _007B3819_007D + num2; i++)
		{
			foreach (PlayerShipInfo item2 in (IEnumerable<PlayerShipInfo>)Gameplay.PlayersInfo)
			{
				PlayerShipInfo item = item2;
				if (!item.CanBeUsedForNpc || item.AssotiatedHazardZoneLevel != i || Array.IndexOf(_007B3826_007D, item.Class) == -1 || (_007B3824_007D.HasValue && _007B3824_007D != item.Fraction))
				{
					continue;
				}
				bool flag = _007B3825_007D;
				bool flag2 = flag;
				if (flag2)
				{
					bool flag3;
					switch (item.ID)
					{
					case 13:
					case 18:
					case 23:
					case 40:
						flag3 = true;
						break;
					default:
						flag3 = false;
						break;
					}
					flag2 = flag3;
				}
				if (!flag2 && (!_007B3823_007D || ((item.Rank != 1 || item.Class != ShipClass.Hardship) && (item.Rank != 2 || item.AssotiatedHazardZoneLevel <= _007B3819_007D || item.Class != ShipClass.Hardship))) && !(item.Class == ShipClass.Mortar && _007B3819_007D < 3 && _007B3820_007D) && tlist.IndexOf(in item) == -1)
				{
					tlist.Add(in item);
				}
			}
		}
		if (tlist.Size == 0)
		{
			return null;
		}
		tlist.Shuffle(_007B3818_007D);
		PlayerShipInfo outShipId = tlist.Rand(_007B3818_007D);
		if (_007B3820_007D)
		{
			while (outShipId.Class == ShipClass.Mortar && mortarShipLimit.IndexOf(in _007B3819_007D) != -1)
			{
				outShipId = tlist.Rand(_007B3818_007D);
			}
			if (outShipId.Class == ShipClass.Mortar)
			{
				mortarShipLimit.Add(in _007B3819_007D);
			}
		}
		if (_007B3821_007D && outShipId.Class != ShipClass.Mortar)
		{
			if (allShipLimit.Count((int _007B3858_007D) => _007B3858_007D == outShipId.ID) >= 1)
			{
				outShipId = tlist.Rand(_007B3818_007D);
			}
			if (allShipLimit.Count((int _007B3859_007D) => _007B3859_007D == outShipId.ID) >= 2)
			{
				outShipId = tlist.Rand(_007B3818_007D);
			}
			allShipLimit.Add((int)outShipId.ID);
		}
		return outShipId;
	}

	public static void FillNpcStats(Sequence _007B3827_007D, WorldMapRegionInfo _007B3828_007D, int _007B3829_007D, NpcGenerator _007B3830_007D, PlayerShipInfo _007B3831_007D, CannonClass _007B3832_007D)
	{
		_007B3830_007D.Location = new NpcLocation(_007B3828_007D);
		_007B3830_007D.Ship = _007B3831_007D.StaticInfo.ID;
		_007B3830_007D.DefenceWaves = new(NpcGenerator, int)[0];
		_007B3830_007D.AttackID = -1;
		float num = Math.Min((float)_007B3829_007D / 7f, 1f);
		float num2 = ((_007B3831_007D.Class == ShipClass.Destroyer) ? 1f : ((_007B3831_007D.Class == ShipClass.Mortar) ? 0.5f : 0f)) * num;
		float num3 = _007B3829_007D switch
		{
			6 => 0.15f, 
			5 => 0.07f, 
			_ => 0f, 
		};
		float[] array = new float[6];
		for (int i = 0; i < 6; i++)
		{
			array[i] = _007B3827_007D.Float();
		}
		_007B3830_007D.Armor = _007B3831_007D.PatArmor + MathHelper.Lerp(MaxOrNegativeUpgradeAmount(_007B3813_007D: false, _007B3831_007D, ShipBonusEffect.MArmor) - 0.3f, MaxOrNegativeUpgradeAmount(_007B3813_007D: true, _007B3831_007D, ShipBonusEffect.MArmor), array[0]);
		if (_007B3831_007D.Coolness == PlayerShipCoolness.Elite)
		{
			_007B3830_007D.Armor -= 0.5f;
		}
		_007B3830_007D.Speed = _007B3831_007D.PatSpeed - (1f - num) + num3 + num2 * 1.5f + MathHelper.Lerp(MaxOrNegativeUpgradeAmount(_007B3813_007D: false, _007B3831_007D, ShipBonusEffect.MSpeed), MaxOrNegativeUpgradeAmount(_007B3813_007D: true, _007B3831_007D, ShipBonusEffect.MSpeed), array[1]);
		float num4 = Geometry.Saturate((_007B3831_007D.PatHealth - 700f) / 700f * (1f - 2f * num));
		_007B3830_007D.Hp = _007B3831_007D.PatHealth * (0.7f + 0.3f * num + 0.2f * num2 - num4 * 0.14f) + MathHelper.Lerp(MaxOrNegativeUpgradeAmount(_007B3813_007D: false, _007B3831_007D, ShipBonusEffect.MHealth), MaxOrNegativeUpgradeAmount(_007B3813_007D: true, _007B3831_007D, ShipBonusEffect.MHealth), array[2]);
		if (_007B3829_007D == 0)
		{
			_007B3830_007D.Hp *= 0.85f;
		}
		if (_007B3829_007D == 1)
		{
			_007B3830_007D.Hp *= 0.9f;
		}
		_007B3830_007D.Mobility = _007B3831_007D.PatMobility + MathHelper.Lerp(MaxOrNegativeUpgradeAmount(_007B3813_007D: false, _007B3831_007D, ShipBonusEffect.MMobilityBonus), MaxOrNegativeUpgradeAmount(_007B3813_007D: true, _007B3831_007D, ShipBonusEffect.MMobilityBonus), array[4]);
		CannonGameInfo cannonGameInfo = WeaponHelper(_007B3832_007D, array[3]);
		_007B3830_007D.DamagePerShot = cannonGameInfo.Penetration * (float)_007B3831_007D.StaticInfo.LeftSidePorts.Length * 0.9f * (0.5f + 0.5f * num + num3);
		if (_007B3829_007D == 0)
		{
			_007B3830_007D.DamagePerShot *= 0.85f;
		}
		_007B3830_007D.ReloadCannonTime = cannonGameInfo.ReloadTime * (1f - 0.2f * num2);
		_007B3830_007D.AttackDistance = (int)(cannonGameInfo.MaxDistance * MathHelper.Lerp(0.8f, 1f, num) + 10f * (num + num2 * 0.2f) * (float)((cannonGameInfo.maxDistance < 160f) ? 1 : 0));
		if (_007B3830_007D.ReloadCannonTime < 5000f)
		{
			_007B3830_007D.ReloadCannonTime = 5500f;
		}
	}

	public static void NpcStatHelper(Sequence _007B3833_007D, NpcGenerator _007B3834_007D, WorldMapRegionInfo _007B3835_007D, int _007B3836_007D, CannonClass _007B3837_007D, bool _007B3838_007D, bool _007B3839_007D, bool _007B3840_007D, bool _007B3841_007D = false, FractionID? _007B3842_007D = null, bool _007B3843_007D = false, params ShipClass[] _007B3844_007D)
	{
		int num = 0;
		PlayerShipInfo playerShipInfo = null;
		while (playerShipInfo == null)
		{
			playerShipInfo = GetPlayerShipInfo(_007B3833_007D, _007B3836_007D + num, _007B3838_007D, _007B3839_007D, _007B3840_007D, _007B3841_007D, _007B3842_007D, _007B3843_007D, _007B3844_007D);
			if (_007B3840_007D)
			{
				_007B3840_007D = false;
			}
			else if (playerShipInfo == null)
			{
				GameLoader.Current.AddImportant("Procedural NpcStatHelper error, mapId: " + _007B3836_007D);
				num++;
			}
		}
		FillNpcStats(_007B3833_007D, _007B3835_007D, _007B3836_007D, _007B3834_007D, playerShipInfo, _007B3837_007D);
	}

	internal static void GenerateNpcStaticUpgrades(StaticEffectsCalculator _007B3845_007D, PassingMapDiffCard[] _007B3846_007D)
	{
		_007B3845_007D.Add(ShipBonusEffect.MHealth, 150f);
		_007B3845_007D.Add(ShipBonusEffect.PBallDamage, _007B3846_007D.Length * 2);
		foreach (PassingMapDiffCard passingMapDiffCard in _007B3846_007D)
		{
			if (passingMapDiffCard == PassingMapDiffCard.ImprovedNpcCrewAndReload)
			{
				_007B3845_007D.Add(ShipBonusEffect.MExtraPlaces, 10f);
				_007B3845_007D.Add(ShipBonusEffect.PCannonsReload, 20f);
			}
			if (passingMapDiffCard == PassingMapDiffCard.ImprovedNpcsAmmo)
			{
				_007B3845_007D.Add(ShipBonusEffect.PBallDamage, 15f);
			}
			if (passingMapDiffCard == PassingMapDiffCard.ImprovedNpcSpeedAndMobility)
			{
				_007B3845_007D.Add(ShipBonusEffect.PSpeed, 15f);
				_007B3845_007D.Add(ShipBonusEffect.MMobilityBonus, 7f);
				_007B3845_007D.Add(ShipBonusEffect.PChangeShipSpeedBonus, 20f);
			}
			if (passingMapDiffCard == PassingMapDiffCard.ImprovedNpcStrength)
			{
				_007B3845_007D.Add(ShipBonusEffect.MArmor, 1f);
				_007B3845_007D.Add(ShipBonusEffect.PArmor, 20f);
				_007B3845_007D.Add(ShipBonusEffect.PHealth, 7f);
			}
		}
	}

	internal static void GenerateNpcStaticUpgradesEmpireInvasion(StaticEffectsCalculator _007B3847_007D, float _007B3848_007D)
	{
		_007B3847_007D.Add(ShipBonusEffect.PHealth, _007B3848_007D * 50f);
		_007B3847_007D.Add(ShipBonusEffect.MHealth, _007B3848_007D * 500f);
		_007B3847_007D.Add(ShipBonusEffect.PSpeed, _007B3848_007D * 10f);
		_007B3847_007D.Add(ShipBonusEffect.MArmor, _007B3848_007D * 3.5f);
		_007B3847_007D.Add(ShipBonusEffect.PBallDamage, _007B3848_007D * 50f);
		_007B3847_007D.Add(ShipBonusEffect.MExtraPlaces, _007B3848_007D * 11f * 4f);
	}

	internal static void GenerateNpcStaticUpgrades(StaticEffectsCalculator _007B3849_007D, NpcInfo _007B3850_007D)
	{
		NpcType descritpion = _007B3850_007D.Descritpion;
		if (((uint)(descritpion - 12) <= 1u || descritpion == NpcType.HeadHunter) ? true : false)
		{
			_007B3849_007D.Add(ShipBonusEffect.PMarchingSpeed, 40f);
		}
	}

	private static ShipUpgradeInfo GetUpgradeByEff(ShipBonusEffect _007B3851_007D, int _007B3852_007D)
	{
		return Gameplay.ShipUpgradesInfo.MaxItem(delegate(ShipUpgradeInfo _007B3860_007D)
		{
			float num = _007B3860_007D.GetEffects(Gameplay.PlayersInfo.First((PlayerShipInfo _007B3861_007D) => _007B3861_007D.Rank == _007B3852_007D)).Sum((ShipBonus _007B3862_007D) => (_007B3862_007D.Type == _007B3851_007D) ? _007B3862_007D.Value : 0f);
			return (num > 0f) ? (0f - num) : (-2.1474836E+09f);
		});
	}

	internal static Tlist<int> GenerateNpcUpgrades(NpcInfo _007B3853_007D, bool _007B3854_007D, PassingMapDiffCard[] _007B3855_007D = null)
	{
		Tlist<ShipBonusEffect> tlist = new Tlist<ShipBonusEffect>();
		int num = 0;
		num = ((!_007B3854_007D) ? Rand.Pick<int>(0, 1, 2, 2) : 2);
		if (_007B3853_007D.Extras.MoreRandomUpgrades)
		{
			num = Math.Max(1, num) + 2;
		}
		for (int i = 0; i < num; i++)
		{
			ShipBonusEffect item;
			do
			{
				item = Rand.Pick(_007B3854_007D ? randomUpgradesPassingMap : randomUpgrades);
			}
			while (tlist.Contains(item));
			tlist.Add(in item);
		}
		Tlist<int> tlist2 = new Tlist<int>();
		foreach (int item2 in ((IEnumerable<ShipBonusEffect>)tlist).Select((Func<ShipBonusEffect, int>)((ShipBonusEffect _007B3863_007D) => GetUpgradeByEff(_007B3863_007D, _007B3853_007D.BasedOn.Rank).ID)))
		{
			tlist2.Add(item2);
		}
		return tlist2;
	}
}
