using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Runtime.CompilerServices;
using System.Text;
using Common.Account;
using Common.Data;
using Common.Packets;
using Common.Resources;
using CommonDataTypes;
using Microsoft.Xna.Framework;
using TheraEngine;
using TheraEngine.Collections;
using TheraEngine.Helpers;

namespace Common.Game;

public sealed class Gameplay
{
	public const int ShipRanksCount = 7;

	public static XmlAssetLibrary<ShipStaticInfo, ShipStaticInfoToken> ShipsStaticInfo;

	public static XmlAssetLibrary<PlayerShipInfo, ShipToPlayToken> PlayersInfo;

	public static XmlAssetLibrary<NpcInfo, NpcGenerator> NpcsInfo;

	public static XmlAssetLibrary<RangInfo, RangInfoToken> RangsInfo;

	public static XmlAssetLibrary<CannonBallInfo, CannonBallInfoToken> BallsInfo;

	public static XmlAssetLibrary<CannonGameInfo, CannonGameInfoToken2> CannonsGameInfo;

	public static XmlAssetLibrary<UnitInfo, UnitInfoToken> UnitsInfo;

	public static Tlist<UnitInfo> AllSpecialUnits;

	public static XmlAssetLibrary<ShipDesignInfo, ShipDesingElementInfoToken> DesignsInfo;

	public static XmlAssetLibrary<ShipDesignInfo, ShipDesingElementInfoToken> EnvDecorElementsInfo;

	public static XmlAssetLibrary<MapForPassingInfo, MapForPassingInfoToken> MapsForPassing;

	public static XmlAssetLibrary<ResourceInfo, ResourceInfoToken> ItemsInfo;

	public static XmlAssetLibrary<MapArenaInfo, MapArenaInfoToken> ArenaMaps;

	public static XmlAssetLibrary<PowderKegInfo, PowderKegInfoToken> PowderKegsInfo;

	public static XmlAssetLibrary<AchievementDisplayInfo, AchievementDisplayInfoToken> AchievementsDisplayInfo;

	public static XmlAssetLibrary<CaptainSkillInfo, CaptainSkillBonusInfoToken> CaptainSkillsInfo;

	internal static LinkedDictionrary<PDynamicAccountBonus, CaptainSkillInfo> CaptainSkillsIDs;

	public static XmlAssetLibrary<ShipUpgradeInfo, ShipUpgradeInfoTokenNew> ShipUpgradesInfo;

	public static XmlAssetLibrary<ArenaUpgradeInfo, ArenaUpgradeInfoToken> ArenaUpgrades;

	public static Tlist<PowerupItemInfo> PowerupItems;

	public static XmlAssetLibrary<QuestInfo> QuestsInfo;

	public static Tlist<QuestInfo> EducationQuestsList;

	public static LinkedDictionrary<IslePortInfo, QuestInfo> QuestsByPort;

	public static LinkedDictionrary<InitialDynamicBuildingId, DynamicBuildingInfo> DyanmicBuildingsDictionary;

	public static Tlist<DynamicBuildingInfo> DyanmicBuildingsTable;

	public static XmlAssetLibrary<GamepediaArticleInfo, GamepediaArticleInfoToken> Gamepedia;

	public static XmlAssetLibrary<GuildTitle, GuildTitleToken> GuildTitles;

	public static XmlAssetLibrary<TradingRouteInfo, List<Vector2>> TradingRoutesInfo;

	public static XmlAssetLibrary<InterestPointInfo, InterestPointInfoToken> InterestPointsInfo;

	internal static Dictionary<ShipClass, ResearchShipClassTable> ResearchShipTable;

	public static Tlist<PlayerShipInfo> SortedPlayersInfoList;

	public static Dictionary<AchievementEnum, AchievementDisplayInfo> AchievementsByEnum;

	internal static Tlist<ShipDesignInfo> RandomSailesForNpcs;

	internal static Tlist<ShipDesignInfo> RandomDesignsForAltar;

	public static Dictionary<string, GeneratorPreset> ProceduralGeneratorPresets;

	public static LinkedDictionrary<PortLevelBonusType, PortLevelBonus> PortLevelBonuses;

	public static LinkedDictionrary<FractionID, GuildTitle> GuildTitlesByFraction;

	public const float CShipMovement = 0.00036421f;

	internal const float CShipSpeed3Start = 2.5f;

	internal const float CShipSpeed3Finish = 4.5f;

	internal const float CShipSpeed3BonusNpc = 5f;

	public const float CShipSpeed3Finish_add = 0.45f;

	public static readonly (float, float) CShipSpeed3Finish_loss = (2.5f, 7f);

	public const float CSpeedStartDrift = 18f;

	public const float CSpeedStartDriftRang2p = 19f;

	public const float CShipTiltFromWind = 1f;

	public const float CannonballSpeed = 45.760002f;

	internal static float CSailAnimDurationBasic = 3f;

	public const float MaxShipOverload = 2.5f;

	public const float WorldMapSizeX = 14146.483f;

	public const float WorldMapSizeY = 17290.12f;

	public const float WorldMaxMapSizeX = 17843.484f;

	public const float WorldMaxMapSizeY = 21826.12f;

	public const float EducationMapSize = 1150f;

	public static readonly float NpcSpawnGuildPatrolRadiusOfFort = 510f;

	public static readonly float PortAquatoriaSize = 765f;

	public const float PremiumBonus = 0.4f;

	public const float PremiumBonus3SlotReloadBoost = 0.4f;

	public const float MendingAmountPerSec = 9f;

	public const float MendingAmountPerSecRang123 = 15f;

	public const float MicroburningDamage = 4f;

	public const float BurningLoopMs = 1000f;

	public const float MendingLoop = 900f;

	public const float SteamWheelCoalLoop = 1000f;

	public const float SteamWheelCoalUsingCost = 0.1f;

	public const float WaitSessionMapToClose = 3000f;

	public const float PowerupItemExtraSlotTimeoutMs = 120000f;

	public const float RocketReloadMs = 23000f;

	public const float BlackMarkTimeInitial = 900f;

	public const float BlackMarkTimeMax = 1800f;

	public const bool StartReloadingWithExitOfPort = false;

	public const bool RespawnVillageAsMiniPort = true;

	public static readonly OpenWorldFlag? SetFlagRespawnOnVillage = null;

	public const float MaxDistanceToRespawnOnFloatingVillage = 1300f;

	public const bool PharosesAsVilages = true;

	public const float NpcWorldMapBorder = 50f;

	public const float SimpleTradersMaxDistanceFromPort = 1900f;

	public const float PFv6RadisPersonalIsle = 255f;

	public const float SpecialLootAreaSize = 450f;

	public static readonly Vector3[] WorldHazardZones = (Vector3[])(object)new Vector3[1]
	{
		new Vector3(temoraryMapHelper(1763f, 1312f), Vector2.Distance(temoraryMapHelper(2907f, 1585f), temoraryMapHelper(2104f, 1583f)) * 0.9f)
	};

	internal static readonly Vector3[] LegendBossZone = (Vector3[])(object)new Vector3[1]
	{
		new Vector3(temoraryMapHelper(1763f, 1302f), Vector2.Distance(temoraryMapHelper(2008f, 1580f), temoraryMapHelper(1090f, 1559f)))
	};

	public static int HazardWatersBlockUntilRank = 12;

	public const float TimeToRespawnBeingOnBoat = 240f;

	public const float BattleEndTimerPve = 25000f;

	public const float BattleEndTimerPvp = 40000f;

	public const float BattleEndTimerPB = 40000f;

	public const float AgressionFlagResetTimerSec = 120f;

	internal static readonly Dictionary<UpgradeStrengthWear, RTI> UpgradesStrength = new Dictionary<UpgradeStrengthWear, RTI>
	{
		[UpgradeStrengthWear.None] = 0,
		[UpgradeStrengthWear.MortarShotsCount] = 500,
		[UpgradeStrengthWear.ReceivedDamage] = 150000,
		[UpgradeStrengthWear.SailingDistance] = 220000,
		[UpgradeStrengthWear.ShotsCount] = 1400
	};

	public const int DestroyCannonsBeforeShotsNum = 350;

	private static int[] ShipResearchCostByLevel = new int[7] { 0, 800, 4500, 14000, 25000, 50000, 70000 };

	internal static readonly RTI[] arenaUpgradePrices = new RTI[24]
	{
		30, 40, 50, 55, 60, 65, 70, 80, 90, 100,
		110, 120, 130, 140, 150, 160, 170, 180, 190, 200,
		210, 220, 230, 240
	};

	public const float PassingMapLifeUnderTowerSec_Single = 240f;

	public const float PassingMapLifeUnderTowerSec_Multiplayer = 160f;

	public static readonly int WelcomeBack_Days = 37;

	public static readonly RTI WelcomeBack_Gold_low = 30000;

	public static readonly RTI WelcomeBack_Gold_high = 150000;

	public static readonly RTI WelcomeBack_FreeResTeleports = 3;

	public static readonly RTI WelcomeBack_PremDays = 15;

	public static readonly int ReferalBonusRank = 10;

	public static readonly float ReferalReplenishShare = 0.05f;

	internal const int MonetsFor30Referals = 1000;

	public static int ReferalBonusExtraShips = 3;

	public static int ReferalBonusExtraPremium = 3;

	public static readonly RTI PublicDesignPrice = 6800;

	public static readonly RTI ChangeNicknameCost = new RTI(290);

	internal static readonly RTI InitialPlacesForShips = 6;

	public const int GuildInviteTimeoutSec = 604800;

	public static readonly RTI ExchangeMarkToConquerorBadges = new RTI(300);

	public static readonly RTI ExchangeMarkToConquerorBadges_PiratePort = new RTI(200);

	public static float BasicXpInGold = 0.4f;

	internal static float GameSpeed = 1.35f;

	internal static float IncreaseDropOutsideSeam = 1.33f;

	internal static float WorldMapMultiplier = 2.5f;

	internal static float OutsideSeamMultiplier = 2.5f * IncreaseDropOutsideSeam;

	internal static float DefaultBonusMapMultiplier = 2.8f;

	internal static float DefaultArenaMapMultiplier = 2.2f;

	public static WorldMapInfo WorldMap { get; internal set; }

	public static WorldMapInfo StartMap { get; internal set; }

	public static Vector2 WorldMapSizeXY => new Vector2(14146.483f, 17290.12f);

	public static Vector2 WorldMaxMapSizeXY => new Vector2(17843.484f, 21826.12f);

	public static Vector2 WorldMaxAvailableSizeXY => new Vector2(17843.484f, 21826.12f) * 0.925f;

	public static WorldMapInfo MapFromID(int _007B3635_007D)
	{
		if (_007B3635_007D == 0)
		{
			return StartMap;
		}
		return WorldMap;
	}

	internal static IStorageAsset GetResource2<T>(int _007B3636_007D) where T : IStorageAsset
	{
		if (typeof(T) == typeof(ResourceInfo))
		{
			return ItemsInfo.FromID(_007B3636_007D);
		}
		if (typeof(T) == typeof(CannonBallInfo))
		{
			return BallsInfo.FromID(_007B3636_007D);
		}
		if (typeof(T) == typeof(PowderKegInfo))
		{
			return PowderKegsInfo.FromID(_007B3636_007D);
		}
		if (typeof(T) == typeof(ProceduralShipInfo))
		{
			return new ProceduralShipInfo((short)_007B3636_007D);
		}
		throw new NotSupportedException();
	}

	internal static IGameResource GetResource<T>(int _007B3637_007D) where T : IGameResource
	{
		if (typeof(T) == typeof(ResourceInfo))
		{
			return ItemsInfo.FromID(_007B3637_007D);
		}
		if (typeof(T) == typeof(CannonBallInfo))
		{
			return BallsInfo.FromID(_007B3637_007D);
		}
		if (typeof(T) == typeof(PowderKegInfo))
		{
			return PowderKegsInfo.FromID(_007B3637_007D);
		}
		if (typeof(T) == typeof(UnitInfo))
		{
			return UnitsInfo.FromID(_007B3637_007D);
		}
		if (typeof(T) == typeof(ShipDesignInfo))
		{
			return ShipDesignInfo.Resolve(_007B3637_007D);
		}
		if (typeof(T) == typeof(CannonGameInfo))
		{
			return CannonsGameInfo.FromID(_007B3637_007D);
		}
		if (typeof(T) == typeof(PowerupItemInfo))
		{
			return PowerupItems.Array[_007B3637_007D];
		}
		if (typeof(T) == typeof(ProceduralShipInfo))
		{
			return new ProceduralShipInfo((short)_007B3637_007D);
		}
		throw new NotSupportedException();
	}

	public static IStorageAsset GetResource(int _007B3638_007D, StorageAssetEnum _007B3639_007D)
	{
		return _007B3639_007D switch
		{
			StorageAssetEnum.SimpleItem => ItemsInfo.FromID(_007B3638_007D), 
			StorageAssetEnum.Ammo => BallsInfo.FromID(_007B3638_007D), 
			StorageAssetEnum.PowderKeg => PowderKegsInfo.FromID(_007B3638_007D), 
			StorageAssetEnum.Ship_DisplayOnly => new ProceduralShipInfo((short)_007B3638_007D), 
			StorageAssetEnum.Cannon_DiplayOnly => CannonsGameInfo.FromID(_007B3638_007D), 
			StorageAssetEnum.Unit_DiplayOnly => UnitsInfo.FromID(_007B3638_007D), 
			_ => throw new NotSupportedException(), 
		};
	}

	public static WorldMapRegionInfo GetNearWorldRegion(in Vector2 _007B3640_007D)
	{
		return WorldMap.GetNearWorldRegion(in _007B3640_007D);
	}

	private static float craftEntry(int _007B3641_007D, int _007B3642_007D)
	{
		WosbCrafting.Recepie[] workshop = WosbCrafting.Workshop;
		foreach (WosbCrafting.Recepie recepie in workshop)
		{
			if (recepie.outputItemId.Value == _007B3642_007D && recepie.outputType == StorageAssetEnum.SimpleItem)
			{
				if (recepie.Craft.InputItems[_007B3641_007D] == 0)
				{
					throw new Exception("craftEntry");
				}
				return recepie.Craft.InputItems[_007B3641_007D];
			}
		}
		throw new Exception("craftEntry");
	}

	public static float CBackwindSpeed(float _007B3643_007D)
	{
		return _007B3643_007D / 3f;
	}

	public static float StormBonusSpeed(float _007B3644_007D, float _007B3645_007D)
	{
		return Math.Max(_007B3644_007D * 3f, Math.Min(8f, _007B3645_007D * 15f));
	}

	public static float CSailAnimDurationSec(Ship _007B3646_007D)
	{
		return CSailAnimDurationBasic + 1f + (1f - _007B3646_007D.UsedShip.Crew.Effectivity(_007B3646_007D.UsedShip)) * 5f;
	}

	private static Vector2 temoraryMapHelper(float _007B3647_007D, float _007B3648_007D)
	{
		//IL_0026: Unknown result type (might be due to invalid IL or missing references)
		//IL_002b: Unknown result type (might be due to invalid IL or missing references)
		//IL_0031: Unknown result type (might be due to invalid IL or missing references)
		//IL_0036: Unknown result type (might be due to invalid IL or missing references)
		//IL_0045: Unknown result type (might be due to invalid IL or missing references)
		//IL_004a: Unknown result type (might be due to invalid IL or missing references)
		//IL_004f: Unknown result type (might be due to invalid IL or missing references)
		//IL_0050: Unknown result type (might be due to invalid IL or missing references)
		//IL_0055: Unknown result type (might be due to invalid IL or missing references)
		//IL_005a: Unknown result type (might be due to invalid IL or missing references)
		//IL_005f: Unknown result type (might be due to invalid IL or missing references)
		//IL_0062: Unknown result type (might be due to invalid IL or missing references)
		_007B3647_007D -= 105f;
		_007B3648_007D -= 120f;
		Vector2 val = default(Vector2);
		((Vector2)(ref val))._002Ector(2566f, 3172f);
		return (new Vector2(_007B3648_007D, _007B3647_007D) - val / 2f) * new Vector2(-1f, 1f) / val * WorldMapSizeXY;
	}

	public static bool IsInHazardZone(in Vector2 _007B3649_007D, float _007B3650_007D = 0f)
	{
		//IL_000c: Unknown result type (might be due to invalid IL or missing references)
		//IL_0011: Unknown result type (might be due to invalid IL or missing references)
		//IL_0017: Unknown result type (might be due to invalid IL or missing references)
		for (int i = 0; i < WorldHazardZones.Length; i++)
		{
			if (Vector2.DistanceSquared(WorldHazardZones[i].XY(), _007B3649_007D) < (WorldHazardZones[i].Z + _007B3650_007D) * (WorldHazardZones[i].Z + _007B3650_007D))
			{
				return true;
			}
		}
		return false;
	}

	public static bool IsPeaceModeEnable(Player _007B3651_007D, bool _007B3652_007D, EventActionsPipelineBase _007B3653_007D)
	{
		//IL_0009: Unknown result type (might be due to invalid IL or missing references)
		//IL_000e: Unknown result type (might be due to invalid IL or missing references)
		//IL_0030: Unknown result type (might be due to invalid IL or missing references)
		//IL_0023: Unknown result type (might be due to invalid IL or missing references)
		//IL_0029: Unknown result type (might be due to invalid IL or missing references)
		//IL_0031: Unknown result type (might be due to invalid IL or missing references)
		//IL_00a9: Unknown result type (might be due to invalid IL or missing references)
		//IL_00ac: Unknown result type (might be due to invalid IL or missing references)
		//IL_0101: Unknown result type (might be due to invalid IL or missing references)
		//IL_0106: Unknown result type (might be due to invalid IL or missing references)
		PlayerAccount accountConnection = _007B3651_007D.AccountConnection;
		Vector2 _007B3649_007D = _007B3651_007D.Position;
		bool flag = accountConnection.WorldFlag.IsPeaceMode();
		if (!WorldMap.IsInsideMap(flag ? _007B3649_007D : (_007B3649_007D * 1.01f)))
		{
			return false;
		}
		bool flag2 = accountConnection.WorldFlag.Mapback() == OpenWorldFlag.Trader;
		if ((flag2 ? accountConnection.WantedLevelDisallowsPeacefulFlag : accountConnection.WantedLevelDisallowsPeacefulFlag) && !accountConnection.IsPeaceActivated && accountConnection.PeaceExtraTimeSec != 0f && !flag)
		{
			return false;
		}
		EABehavior1 actionBehavior = _007B3653_007D.GetActionBehavior1(EActionCaterory.RandomPvpArena);
		if (actionBehavior != null && Vector2.Distance(_007B3649_007D, actionBehavior.Position) <= (float)actionBehavior.ArgumentInt)
		{
			return false;
		}
		if (flag2)
		{
			if (accountConnection.PersonalIsles.Data.Size > 0 && Vector2.DistanceSquared(accountConnection.PersonalIsles.GetNearTo(in _007B3649_007D).Place.GlobalPosition, _007B3649_007D) < 65025f)
			{
				return true;
			}
			if (IsInHazardZone(in _007B3649_007D, (!flag) ? 100 : 0))
			{
				return false;
			}
			return _007B3651_007D.NearAquatoria != null;
		}
		if (accountConnection.WorldFlag == OpenWorldFlag.Peaceful || accountConnection.WorldFlag == OpenWorldFlag.PeacefulDisallowed)
		{
			if (accountConnection.IsPeaceActivated || accountConnection.PeaceExtraTimeSec > 0f)
			{
				return true;
			}
			return !IsInHazardZone(in _007B3649_007D, (!flag) ? 100 : 0);
		}
		return false;
	}

	public static bool IsPlayerPeaceByRank(int _007B3654_007D, int _007B3655_007D, WorldMapInfo _007B3656_007D, bool _007B3657_007D)
	{
		return _007B3656_007D.IsWorldmap && !_007B3657_007D && Math.Min(_007B3654_007D, _007B3655_007D) < HazardWatersBlockUntilRank && Math.Max(_007B3654_007D, _007B3655_007D) >= 15;
	}

	public static (int marksBonus, int xpBonus) GetPvpReward(float _007B3658_007D, int _007B3659_007D)
	{
		int item = 1 + Rand.Round(((1f + (float)_007B3659_007D > 0f) ? 0.8f : 0f) * (_007B3658_007D / 666f));
		int item2 = 1 + (int)(ComputeBasicBonus(_007B3658_007D + 250f, 17f, 2f) * GameSpeed * BasicXpInGold * DefaultArenaMapMultiplier * 0.6f);
		return (marksBonus: item, xpBonus: item2);
	}

	private static List<T> GetAllPublicConstantValues<T>(Type _007B3660_007D, string _007B3661_007D)
	{
		return (from _007B3793_007D in _007B3660_007D.GetFields(BindingFlags.Static | BindingFlags.Public | BindingFlags.FlattenHierarchy)
			where _007B3793_007D.IsLiteral && !_007B3793_007D.IsInitOnly && _007B3793_007D.FieldType == typeof(T) && _007B3793_007D.Name == _007B3661_007D
			select (T)_007B3793_007D.GetRawConstantValue()).ToList();
	}

	public static int GetResIDByAnnotation(string _007B3662_007D)
	{
		return GetAllPublicConstantValues<int>(typeof(GSI), _007B3662_007D)[0];
	}

	internal static void UpgradeCost(ShipUpgradeInfoTokenNew _007B3663_007D, ref CraftingRecipe[] _007B3664_007D, out ResourceInfo _007B3665_007D)
	{
		int num = -1;
		if (!string.IsNullOrEmpty(_007B3663_007D.MainCraftResource))
		{
			num = GetResIDByAnnotation(_007B3663_007D.MainCraftResource);
		}
		_007B3665_007D = ((num == -1) ? null : ItemsInfo.FromID(num));
		_007B3664_007D = new CraftingRecipe[7];
		float num2 = (_007B3663_007D.LowCost ? 0.6f : 1f);
		for (int i = 0; i < 7; i++)
		{
			GSI gSI = new GSI();
			int num3 = 0;
			int num4 = i + 1;
			int num5 = 6 - Math.Min(6, i);
			float num6 = (new float[7] { 0.75f, 2f, 3f, 6f, 8f, 11f, 15f })[num5];
			int num7 = (int)((400f * num6 - 150f) * num2);
			num3 += 50 + num7 / 3;
			if (!_007B3663_007D.LowCost && _007B3663_007D.Category != ShipUpgradeCategory.Sailes && num4 <= 3)
			{
				gSI.Exs(16, (int)Math.Max(0f, (float)num7 / 400f - 0.5f));
			}
			if (num != -1)
			{
				int num8 = num switch
				{
					37 => 25, 
					38 => 600, 
					_ => _007B3665_007D.MediumCost.Value, 
				};
				gSI.Exs(num, (int)Math.Max(1f, 1.6800001f * (float)(50 + num7 / 2) / (float)num8));
			}
			else if (_007B3663_007D.Category != ShipUpgradeCategory.Sailes)
			{
				num3 *= 2;
			}
			if (num4 <= 5)
			{
				gSI.Exs(2, num7 / 10);
				num3 = (int)((float)num3 * 0.75f);
			}
			else
			{
				num3 = (int)((float)num3 * 1.5f);
			}
			if (_007B3663_007D.Category == ShipUpgradeCategory.Sailes && (num4 == 7 || num4 == 6))
			{
				gSI[2] = 0;
				num3 *= 2;
				if (num == 17)
				{
					gSI[3] = gSI[17] * 30;
					gSI[17] = 0;
				}
				if (num == 38)
				{
					gSI[17] = gSI[38] * 10;
					gSI[38] = 0;
				}
			}
			_007B3664_007D[i] = new CraftingRecipe(gSI, num3);
		}
	}

	public static (int xp, GSI price) OpenExtraUpgradeSlotPrice(PlayerShipInfo _007B3666_007D, int _007B3667_007D)
	{
		int shipResearchCostByLevel = GetShipResearchCostByLevel(_007B3666_007D.Rank);
		shipResearchCostByLevel = _007B3667_007D switch
		{
			2 => shipResearchCostByLevel / 2 + 500, 
			3 => shipResearchCostByLevel + 1000, 
			_ => shipResearchCostByLevel / 4 + 250, 
		};
		GSI gSI = new GSI();
		if (_007B3666_007D.Rank == 7)
		{
			gSI.Exs(1, Math.Max(10, shipResearchCostByLevel / 40));
		}
		else if (_007B3666_007D.Rank == 6)
		{
			gSI.Exs(1, Math.Max(10, shipResearchCostByLevel / 10));
		}
		else if (_007B3666_007D.Rank == 5)
		{
			gSI.Exs(37, shipResearchCostByLevel / 60);
		}
		else
		{
			gSI.Exs(37, shipResearchCostByLevel / 30);
		}
		return (xp: shipResearchCostByLevel, price: gSI);
	}

	public static int DestroyMortarResource(CannonGameInfo _007B3668_007D)
	{
		return (_007B3668_007D.Feature == CannonFeature.Default) ? 1200 : 600;
	}

	public static float DestroyCannonsShotWeight(ShipStaticInfo _007B3669_007D)
	{
		return 1f + 2f * (float)Math.Min(_007B3669_007D.LeftSidePorts.Length / 70, 1);
	}

	internal static CraftingRecipe CannonCraftCost(CannonGameInfo _007B3670_007D, int _007B3671_007D)
	{
		if (_007B3670_007D.CraftingType == ShipCannonCrafting.ByGold)
		{
			return new CraftingRecipe(_007B3671_007D);
		}
		int num;
		if (_007B3670_007D.Class == CannonClass.Mortar)
		{
			if (_007B3670_007D.Poundage != 6 && _007B3670_007D.Poundage != 7)
			{
				if (_007B3670_007D.Poundage != 8 && _007B3670_007D.Poundage != 9 && _007B3670_007D.Feature == CannonFeature.Default)
				{
					if (_007B3670_007D.Poundage != 10 && _007B3670_007D.Poundage != 11)
					{
						throw new InvalidOperationException("Unknown mortar category for " + _007B3670_007D.Name);
					}
					num = 2;
				}
				else
				{
					num = 1;
				}
			}
			else
			{
				num = 0;
			}
		}
		else
		{
			num = (int)_007B3670_007D.Category;
		}
		return (CannonCategory)num switch
		{
			CannonCategory.Light => GetRecipeByPercentages(_007B3671_007D, (4, 60), (2, 40)), 
			CannonCategory.Medium => GetRecipeByPercentages(_007B3671_007D, (4, 45), (2, 20), (11, 35)), 
			CannonCategory.Heavy => GetRecipeByPercentages(_007B3671_007D, (4, 30), (23, 10), (37, 15), (14, 45)), 
			_ => throw new InvalidOperationException("Unknown recipe for " + _007B3670_007D.Name), 
		};
	}

	private static CraftingRecipe GetRecipeByPercentages(int _007B3672_007D, params (int resId, int percentage)[] _007B3673_007D)
	{
		int num = 0;
		int num2 = ItemsInfo.FromID(_007B3673_007D[0].resId).MediumCost.Value;
		int[] array = new int[_007B3673_007D.Length];
		float num3 = 0f;
		for (int i = 0; i < _007B3673_007D.Length; i++)
		{
			(int resId, int percentage) tuple = _007B3673_007D[i];
			int item = tuple.resId;
			int item2 = tuple.percentage;
			int value = ItemsInfo.FromID(item).MediumCost.Value;
			if (item2 > 0 && value > 0)
			{
				if (value < num2)
				{
					num2 = value;
					num = i;
				}
				array[i] = _007B3672_007D * item2 / 100 / value;
				num3 += (float)(array[i] * value);
			}
		}
		float num4 = (float)_007B3672_007D - num3;
		if ((double)Math.Abs(num4) > 0.0001)
		{
			int value2 = ItemsInfo.FromID(_007B3673_007D[num].resId).MediumCost.Value;
			int num5 = (int)MathF.Round(num4 / (float)value2);
			array[num] += num5;
			num3 += (float)(num5 * value2);
			if (Math.Abs((float)_007B3672_007D - num3) > Math.Abs(num4))
			{
				array[num] -= num5;
			}
		}
		GSI gSI = new GSI();
		for (int j = 0; j < array.Length; j++)
		{
			if (array[j] > 0)
			{
				gSI.Exs(_007B3673_007D[j].resId, array[j]);
			}
		}
		return new CraftingRecipe(gSI, 0);
	}

	internal static int GetShipResearchCostByLevel(int _007B3674_007D)
	{
		int num = 7 - _007B3674_007D;
		return ShipResearchCostByLevel[num];
	}

	public static int ShipResearchCost(ShipClass _007B3675_007D, int _007B3676_007D)
	{
		int num = 7 - _007B3676_007D;
		int num2 = ResearchShipTable[_007B3675_007D].PreviousShipRank(_007B3676_007D);
		if (num2 != -1 && num2 - _007B3676_007D >= 2)
		{
			num--;
		}
		float num3 = ShipResearchCostByLevel[num];
		if (_007B3675_007D == ShipClass.Destroyer)
		{
			num3 *= 0.8f;
		}
		if (_007B3675_007D == ShipClass.Battleship)
		{
			num3 *= 1.1f;
		}
		if (_007B3675_007D == ShipClass.CargoShip)
		{
			num3 *= 0.9f;
		}
		if (_007B3675_007D == ShipClass.Hardship)
		{
			num3 *= 1.2f;
		}
		return (int)num3;
	}

	public static float ResearchBonus(int _007B3677_007D)
	{
		if (_007B3677_007D == 0)
		{
			return 0f;
		}
		return (float)(_007B3677_007D + 1) * 0.1f;
	}

	public static float ShipwayDuration(PlayerShipInfo _007B3678_007D, float _007B3679_007D = 1f)
	{
		if (_007B3678_007D.Coolness == PlayerShipCoolness.Elite || _007B3678_007D.Coolness == PlayerShipCoolness.Unique)
		{
			return 0f;
		}
		if (_007B3678_007D.Rank == 7)
		{
			return 60f * _007B3679_007D;
		}
		if (_007B3678_007D.Rank == 6)
		{
			return 300f * _007B3679_007D;
		}
		if (_007B3678_007D.Rank == 5)
		{
			return 600f * _007B3679_007D;
		}
		if (_007B3678_007D.Rank == 4)
		{
			return 3600f * _007B3679_007D;
		}
		if (_007B3678_007D.Rank == 3)
		{
			return 7200f * _007B3679_007D;
		}
		if (_007B3678_007D.Rank == 2)
		{
			return 14400f * _007B3679_007D;
		}
		if (_007B3678_007D.Rank == 1)
		{
			return 21600f * _007B3679_007D;
		}
		throw new NotSupportedException();
	}

	public static GSI ShipwayQuickFinishPrice(PlayerShipInfo _007B3680_007D, float _007B3681_007D)
	{
		int _007B5449_007D = (int)Math.Max((8 - _007B3680_007D.Rank) * 10, (float)_007B3680_007D.CraftCostDefault[37] * (1f - _007B3681_007D));
		return new GSI().Exs(37, _007B5449_007D);
	}

	internal static GSI GetBasicShipCraftPrice(PlayerShipCoolness _007B3682_007D, ShipClass _007B3683_007D, int _007B3684_007D, int _007B3685_007D, float _007B3686_007D, float _007B3687_007D, float _007B3688_007D, float _007B3689_007D, float _007B3690_007D, float _007B3691_007D, float _007B3692_007D)
	{
		GSI gSI = new GSI();
		float avg = GameplayAssist.avgShipRankHp[_007B3685_007D].Avg;
		int num = _007B3685_007D;
		if ((_007B3682_007D == PlayerShipCoolness.Elite || _007B3682_007D == PlayerShipCoolness.Unique) && _007B3685_007D >= 2)
		{
			num++;
		}
		float num2 = num switch
		{
			5 => 0.25f, 
			4 => 0.5f, 
			3 => 0.8f, 
			2 => 1.13f, 
			1 => 1.8700001f, 
			0 => 3.375f, 
			_ => 0.11f, 
		};
		if (_007B3683_007D == ShipClass.Destroyer)
		{
			num2 *= 1.2f;
		}
		if (_007B3682_007D == PlayerShipCoolness.Elite && _007B3685_007D != 0)
		{
			num2 *= 1.25f;
		}
		float num3 = (9600f * (_007B3686_007D / 1500f) + 9000f * (_007B3688_007D / 25000f)) * num2 * 0.9f;
		float num4 = 1000f * _007B3687_007D * (avg / 1000f) * num2;
		float num5 = ((_007B3685_007D <= 4) ? ((_007B3691_007D - 10f + 5f * Math.Max(0f, _007B3692_007D / 100f - 0.9f)) * (avg / 70f) * num2) : 0f);
		float num6 = ((_007B3685_007D <= 3) ? (2f * ((_007B3689_007D + _007B3690_007D * (float)(9 - _007B3685_007D)) / 5f) * num2) : 0f);
		num3 -= num4 * 0.1f;
		num4 *= 0.9f;
		num6 *= 1.15f;
		if (_007B3684_007D == 27)
		{
			num5 = 14f;
		}
		if (_007B3684_007D == 56)
		{
			gSI.Exs(15, 1000);
			return gSI;
		}
		if (_007B3685_007D == 6)
		{
			gSI.Exs(1, roundHelper(num3));
			gSI.Exs(4, roundHelper(num4));
			gSI.Exs(3, 30);
			return gSI;
		}
		float num7 = num3 / craftEntry(1, 27);
		float num8 = Math.Max(0f, (num4 - num7 * craftEntry(4, 27)) / craftEntry(4, 29)) + (float)(10 - _007B3685_007D) * _007B3690_007D;
		bool flag = _007B3685_007D <= 4;
		bool flag2 = flag;
		if (flag2)
		{
			bool flag3 = (((uint)_007B3683_007D <= 2u || _007B3683_007D == ShipClass.Mortar) ? true : false);
			flag2 = flag3;
		}
		if (flag2)
		{
			float num9 = 0f;
			if (_007B3685_007D == 1 || _007B3685_007D == 0)
			{
				num9 = 5f + num6 * 1.5f / 0.85f / 2f;
			}
			if (_007B3685_007D == 2)
			{
				num9 = 6f + num6 * 1.35f / 0.85f / 2f;
			}
			if (_007B3685_007D == 3)
			{
				num9 = 2f + num6 * 1f / 0.85f / 2f;
			}
			if (_007B3685_007D == 4)
			{
				num9 = 1f + num6 * 0.5f / 0.85f / 2f;
			}
			gSI.Exs(37, roundHelper(num9 * 11f));
		}
		else
		{
			gSI.Exs(37, _007B3685_007D switch
			{
				4 => 25, 
				3 => 60, 
				2 => 120, 
				1 => 160, 
				0 => 200, 
				_ => 0, 
			});
		}
		if (_007B3685_007D == 3)
		{
			num6 = 0f;
			num7 *= 1.07f;
			num8 *= 1.07f;
			num5 *= 1.07f;
		}
		if (_007B3685_007D == 5)
		{
			num8 = 0f;
			gSI.Exs(4, roundHelper(num4));
		}
		gSI.Exs(27, roundHelper(num7));
		gSI.Exs(29, roundHelper(num8));
		gSI.Exs(17, roundHelper(num5));
		gSI.Exs(16, roundHelper(num6));
		if (_007B3684_007D == 55)
		{
			gSI.Exs(40, 1);
		}
		return gSI;
	}

	internal static GSI GetBasicShipDecraftPrice(GSI _007B3693_007D, float _007B3694_007D)
	{
		float num = 0.66f;
		num += (1f - num) * _007B3694_007D;
		GSI gSI = _007B3693_007D.Clone(num, RoundMode.Round);
		GSI gSI2 = new GSI();
		foreach (GSILocalPair item in (IEnumerable<GSILocalPair>)gSI)
		{
			if (item.ID == 1 || item.ID == 3 || item.ID == 4)
			{
				gSI2[item.ID] += (int)((float)item.Count * num);
				continue;
			}
			WosbCrafting.Recepie recepie = WosbCrafting.Workshop.FirstOrDefault((WosbCrafting.Recepie _007B3795_007D) => _007B3795_007D.outputItemId.Value == item.ID);
			if (recepie != null)
			{
				gSI2.Add(recepie.Craft.InputItems.Clone(num * (float)item.Count, RoundMode.Round));
			}
		}
		gSI2[12] = 0;
		gSI2[13] = 0;
		return gSI2;
	}

	internal static GSI GetEmpireOrUniqueShipCraftPrice(PlayerShipCoolness _007B3695_007D, int _007B3696_007D, int _007B3697_007D)
	{
		GSI gSI = new GSI();
		if (_007B3695_007D == PlayerShipCoolness.Empire)
		{
			if (_007B3696_007D == 4)
			{
				gSI[67] = 25;
			}
			else
			{
				gSI[68] = _007B3696_007D switch
				{
					3 => 1, 
					2 => 5, 
					1 => 20, 
					0 => 40, 
					_ => 0, 
				};
			}
			gSI[15] = _007B3696_007D switch
			{
				4 => 20, 
				3 => 150, 
				2 => 400, 
				1 => 5000, 
				0 => 10000, 
				_ => 0, 
			};
		}
		if (_007B3695_007D == PlayerShipCoolness.Unique)
		{
			gSI[37] = ((_007B3697_007D == 38) ? 12000 : (_007B3696_007D switch
			{
				5 => (_007B3697_007D == 16) ? 250 : 750, 
				4 => 3000, 
				3 => 4500, 
				2 => 8000, 
				1 => 10000, 
				0 => 15000, 
				_ => 100, 
			}));
		}
		if (gSI.IsEmpty)
		{
			throw new InvalidOperationException($"GetEmpireOrUniqueShipCraftPrice has wrong craft for id {_007B3697_007D}");
		}
		return gSI;
	}

	private static void rdcdc2(GSI _007B3698_007D)
	{
		if (_007B3698_007D.GetTotalItemsCount() <= 1)
		{
			return;
		}
		GSILocalEnumerablePair<ResourceInfo> gSILocalEnumerablePair = default(GSILocalEnumerablePair<ResourceInfo>);
		foreach (GSILocalEnumerablePair<ResourceInfo> item in (IEnumerable<GSILocalEnumerablePair<ResourceInfo>>)_007B3698_007D.ResourceInfo/*cast due to .constrained prefix*/)
		{
			if (item.Count > gSILocalEnumerablePair.Count)
			{
				gSILocalEnumerablePair = item;
			}
		}
		_007B3698_007D[gSILocalEnumerablePair.Info.ID]--;
	}

	public static float RestoreCapitalIntegrityDuration(int _007B3699_007D, int _007B3700_007D)
	{
		if (_007B3699_007D == 62 || _007B3699_007D == 65)
		{
			return 25 * _007B3700_007D;
		}
		return 0.5f + (float)_007B3700_007D * 1.5f;
	}

	public static (GSI, RTI) CapitalRestoreCost(PlayerShipDynamicInfo _007B3701_007D, bool _007B3702_007D, float _007B3703_007D)
	{
		float num = 1f - (float)_007B3701_007D.Integrity / (float)_007B3701_007D.CraftFrom.MaxIntegrity;
		float num2 = num * _007B3703_007D;
		if (_007B3701_007D.CraftFrom.ID == 62 || _007B3701_007D.CraftFrom.ID == 65)
		{
			num2 *= 2f;
			num2 *= 1.7142859f;
		}
		num2 *= 0.4f;
		float num3 = (_007B3702_007D ? 0.125f : 0.25f) * num2;
		float num4 = (_007B3702_007D ? 0.2f : 0f) * num2;
		GSI gSI = new GSI();
		float num5 = 0f;
		foreach (GSILocalEnumerablePair<ResourceInfo> item in (IEnumerable<GSILocalEnumerablePair<ResourceInfo>>)_007B3701_007D.CraftFrom.CraftCostForIntegrity.ResourceInfo/*cast due to .constrained prefix*/)
		{
			if (item.Info.ID != 37 && item.Info.ID != 40 && (!_007B3702_007D || item.Info.ID != 16))
			{
				float num6 = num3 * (float)item.Count;
				float num7 = num4 * (float)item.Info.MediumCost.Value;
				num6 = ((item.Info.ID != 17) ? (num6 * 1.2f) : (num6 * 0.8f));
				int num8 = (int)Math.Round(num6);
				float num9 = num6 - (float)num8;
				if (num9 > 0.1f)
				{
					num8++;
				}
				gSI.Exs((item.Info.ID == 29) ? 27 : item.Info.ID, (item.Info.ID == 29) ? (num8 / 2) : num8);
				num5 += num7 * (float)item.Count;
			}
		}
		if (_007B3702_007D)
		{
			rdcdc2(gSI);
		}
		if (_007B3701_007D.CraftFrom.Coolness == PlayerShipCoolness.Empire && _007B3701_007D.CraftFrom.Rank <= 2)
		{
			gSI[67] = Math.Max(_007B3701_007D.CraftFrom.MaxIntegrity - _007B3701_007D.Integrity, gSI[67]);
		}
		gSI[27] = (int)Math.Ceiling((float)gSI[27] * 0.7f);
		if (gSI[67] == 0)
		{
			if (_007B3701_007D.CraftFrom.Rank == 1)
			{
				gSI.Exs(14, (int)Math.Round(num * 4f));
			}
			if (_007B3701_007D.CraftFrom.Rank == 2)
			{
				gSI.Exs(14, (int)Math.Round(num * 3f));
			}
			if (_007B3701_007D.CraftFrom.Rank == 3)
			{
				gSI.Exs(14, (int)Math.Round(num * 3f));
			}
			if (_007B3701_007D.CraftFrom.Rank == 4)
			{
				gSI.Exs(14, (int)Math.Round(num * 2f));
			}
		}
		return (gSI, new RTI((int)Math.Round(num5)));
	}

	public static GSI MendingCapturedShipPrice(NpcInfo _007B3704_007D, int _007B3705_007D)
	{
		float value = _007B3704_007D.ShipProperties.MaxHp.Value;
		GSI gSI = new GSI();
		double num = 0.5 + 0.333 * (double)_007B3705_007D;
		gSI[1] += Math.Max(1, (int)((double)(value / 3f) * num));
		gSI[3] += Math.Max(1, (int)((double)(value / 3f) * num));
		gSI[4] += Math.Max(0, (int)((double)(value / 4f) * num) - 15);
		return gSI;
	}

	public static float MendingCostWood(int _007B3706_007D)
	{
		return 1f;
	}

	internal static float MendingCostFactor(int _007B3707_007D, int _007B3708_007D)
	{
		float num = ((_007B3707_007D >= 5) ? 1.3f : ((_007B3707_007D >= 2) ? 1.8f : 2.5f));
		if (_007B3708_007D > 17)
		{
			num = Math.Max(num, 1.8f);
		}
		if (_007B3708_007D > 25 && _007B3707_007D >= 5)
		{
			num = Math.Max(num, 2.2f);
		}
		return num;
	}

	public static int MendingCostGoldStrength(PlayerShipDynamicInfo _007B3709_007D, PlayerAccount _007B3710_007D, RespawnHealthAmount _007B3711_007D)
	{
		float num = _007B3709_007D.MaxHp;
		if (_007B3711_007D == RespawnHealthAmount.About75Percent)
		{
			num *= 0.75f;
		}
		if (_007B3711_007D == RespawnHealthAmount.About33Percent)
		{
			num *= 0.33f;
		}
		float num2 = num - _007B3709_007D.firstHP.Summary;
		if (num2 <= 0f)
		{
			return 0;
		}
		if (_007B3709_007D.StaticInfo.IsBalloon)
		{
			return 1000;
		}
		return (int)Math.Ceiling(MendingCostFactor(_007B3709_007D.CraftFrom.Rank, _007B3710_007D.Rang) * num2 * 0.1f);
	}

	public static int MendingCostGoldSailes(PlayerShipDynamicInfo _007B3712_007D, PlayerAccount _007B3713_007D)
	{
		float num = 0.5f * _007B3712_007D.MaxHp * (1f - _007B3712_007D.FirstSailHP);
		if (num <= 0.05f)
		{
			return 0;
		}
		return (int)Math.Ceiling(MendingCostFactor(_007B3712_007D.CraftFrom.Rank, _007B3713_007D.Rang) * num * 0.1f);
	}

	public static int MendingCostGoldTotal(PlayerShipDynamicInfo _007B3714_007D, PlayerAccount _007B3715_007D, bool _007B3716_007D)
	{
		int num = MendingCostGoldStrength(_007B3714_007D, _007B3715_007D, _007B3716_007D ? RespawnHealthAmount.About75Percent : RespawnHealthAmount.Full) + MendingCostGoldSailes(_007B3714_007D, _007B3715_007D);
		return (int)Math.Ceiling((float)num * 0.5f);
	}

	public static int MendingCostGoldTotalAndWeapons(PlayerShipDynamicInfo _007B3717_007D, PlayerAccount _007B3718_007D, bool _007B3719_007D)
	{
		int num = MendingCostGoldTotal(_007B3717_007D, _007B3718_007D, _007B3719_007D);
		if (_007B3717_007D.Cannons.BrokenItems.Size > 0)
		{
			num += 20;
		}
		return num;
	}

	public static int RestoringCostVillage(PlayerAccount _007B3720_007D)
	{
		return Math.Max(MendingCostGoldTotalAndWeapons(_007B3720_007D.Shipyard.CurrentRealShip, _007B3720_007D, _007B3719_007D: false), 15 + _007B3720_007D.Rang * 10);
	}

	public static int NextArenaUpgradePrice(Player _007B3721_007D)
	{
		return arenaUpgradePrices[_007B3721_007D.UsedShipPlayer.DynamicBonus.TotalCountArenaUpgrades()].Value;
	}

	public static (int rating, int gold, int xp, int marks) ComputeArenaReward(ArenaPlayerShowing _007B3722_007D, ArenaBattleResult _007B3723_007D, ArenaMode _007B3724_007D, int _007B3725_007D, float _007B3726_007D, bool _007B3727_007D)
	{
		float num = 0f;
		float num2 = 0f;
		float num3 = 0f;
		float num4 = 0f;
		ArenaModeSettings info = _007B3724_007D.GetInfo();
		float num5 = _007B3722_007D.GetInternalPoints(info.ModeEnum);
		if (_007B3723_007D == ArenaBattleResult.YourComandWin)
		{
			num5 = num5 * 0.65f + _007B3726_007D * 0.35f;
		}
		if (1 == 0)
		{
		}
		float num6 = _007B3725_007D switch
		{
			1 => 0.7f, 
			2 => 0.8f, 
			3 => 0.85f, 
			4 => 1f, 
			5 => 1.15f, 
			_ => 1.4f, 
		};
		if (1 == 0)
		{
		}
		float num7 = num6;
		if (info.ModeEnum == ArenaMode.WallVsWall)
		{
			num = ((_007B3723_007D == ArenaBattleResult.YourComandWin || _007B3727_007D) ? (0.0036f * num7 * num5) : 0f);
			num3 = 0.1f * num5;
			num2 = 0.7f * num7 * num5;
			num4 = 0.002f * num7 * num5;
		}
		if (info.ModeEnum == ArenaMode.Collecting)
		{
			num = ((_007B3723_007D == ArenaBattleResult.YourComandWin || _007B3727_007D) ? (0.0038f * num7 * num5) : 0f);
			num3 = 0.125f * num5;
			num2 = 0.88f * num7 * num5;
			num4 = 0.0025f * num7 * num5;
		}
		if (info.ModeEnum == ArenaMode.DuelRating)
		{
			num = ((_007B3723_007D == ArenaBattleResult.YourComandWin || _007B3727_007D) ? 30 : 0);
			num3 = 0.15f * num5;
			num2 = 1.05f * num5;
			num4 = 0.0025f * num5;
		}
		float num8 = GameSpeed / 1.35f;
		if (_007B3723_007D == ArenaBattleResult.YourComandFail)
		{
			num8 *= ((info.ModeEnum == ArenaMode.DuelRating) ? 0.5f : 0.6f);
		}
		return (rating: (int)Math.Round(num), gold: Rand.Round(num2 * num8), xp: Rand.Round(num3 * num8), marks: Rand.Round(num4 * num8));
	}

	public static Bonus ComputePBReward(float _007B3728_007D)
	{
		float num = _007B3728_007D * GameSpeed * 1.78517f;
		float num2 = _007B3728_007D * BasicXpInGold * 0.482f;
		return new Bonus((int)num, (int)num2);
	}

	public static float ArenaPenaltyTime(ArenaPlayerShowing _007B3729_007D, PlayerAccount _007B3730_007D, bool _007B3731_007D, bool _007B3732_007D, ArenaMode _007B3733_007D)
	{
		float num = 0f;
		float num2 = _007B3729_007D.StatsPerShip.Sum((KeyValuePair<int, ArenaShipStats> _007B3771_007D) => _007B3771_007D.Value.SendDamage);
		float num3 = _007B3729_007D.StatsPerShip.Sum((KeyValuePair<int, ArenaShipStats> _007B3772_007D) => _007B3772_007D.Value.SendDamageBuldings);
		float num4 = _007B3729_007D.StatsPerShip.Sum((KeyValuePair<int, ArenaShipStats> _007B3773_007D) => _007B3773_007D.Value.SendDamageEquip);
		float num5 = _007B3729_007D.StatsPerShip.Sum((KeyValuePair<int, ArenaShipStats> _007B3774_007D) => _007B3774_007D.Value.SendDamageAlly);
		float num6 = _007B3729_007D.StatsPerShip.Sum((KeyValuePair<int, ArenaShipStats> _007B3775_007D) => _007B3775_007D.Value.ReceivedDamage);
		int num7 = _007B3729_007D.StatsPerShip.Sum((KeyValuePair<int, ArenaShipStats> _007B3776_007D) => _007B3776_007D.Value.CargoPoints);
		int num8 = _007B3729_007D.StatsPerShip.Sum((KeyValuePair<int, ArenaShipStats> _007B3777_007D) => _007B3777_007D.Value.LootedCargoPoints);
		if (num2 == 0f && num3 == 0f && num4 == 0f && num6 == 0f && num8 == 0 && num7 == 0 && _007B3731_007D && !_007B3732_007D && _007B3733_007D != ArenaMode.DuelTraning && _007B3733_007D != ArenaMode.DuelRating)
		{
			num = 300f;
		}
		if (num5 > 300f && num5 > num2 + 100f)
		{
			num = Math.Max(num, num5 - 200f);
			if (_007B3730_007D.ArenaPenaltySecExtra > 0f)
			{
				num = 300f + num * 4f;
			}
		}
		return num;
	}

	public static float ArenaBattleRatingBase(int _007B3734_007D)
	{
		if (1 == 0)
		{
		}
		float result = _007B3734_007D switch
		{
			1 => 9.5f, 
			2 => 8f, 
			3 => 6f, 
			4 => 4f, 
			5 => 3f, 
			6 => 2f, 
			7 => 1.5f, 
			_ => throw new NotImplementedException(), 
		};
		if (1 == 0)
		{
		}
		return result;
	}

	public static float ComputeArenaBattleRating(Player _007B3735_007D, ArenaMode _007B3736_007D)
	{
		float num = ArenaBattleRatingBase(_007B3735_007D.UsedShipPlayer.CraftFrom.Rank);
		if (_007B3736_007D.GetInfo().IsDuetl)
		{
			return num;
		}
		num += Math.Clamp((float)(_007B3735_007D.UsedShipPlayer.Upgrades.InstalledCount - 1) * 0.05f, 0f, 0.15f);
		if (_007B3735_007D.UsedShipPlayer.CraftFrom.Coolness == PlayerShipCoolness.Elite)
		{
			num += 0.1f;
		}
		if (_007B3735_007D.AccountConnection.Rang >= 28 || _007B3735_007D.AccountConnection.ArenaRating.Value > 1000)
		{
			num += 0.2f;
		}
		else if (_007B3735_007D.AccountConnection.Rang <= 15)
		{
			num -= 0.1f;
		}
		return num;
	}

	public static int SailingXp(PlayerAccount _007B3737_007D, float _007B3738_007D, GSI _007B3739_007D, out bool _007B3740_007D)
	{
		if (_007B3738_007D > 500f)
		{
			float num = 20f + (float)(11 - _007B3737_007D.Shipyard.CurrentRealShip.CraftFrom.Rank) * _007B3738_007D / 200f;
			num *= 0.8f;
			float num2 = Math.Min(40000f, _007B3739_007D.ComputeMass<ResourceInfo>()) / 20000f;
			if (_007B3740_007D = num2 > 0.3f)
			{
				num *= 1f + num2 * 1.2f;
			}
			if (_007B3737_007D.IsPremium)
			{
				num *= 1.4f;
			}
			if (num > (float)(_007B3737_007D.Rang * 2))
			{
				return (int)num;
			}
		}
		_007B3740_007D = false;
		return 0;
	}

	public static RTI WelcomeBack_Gold(int _007B3741_007D)
	{
		return (_007B3741_007D > 25) ? WelcomeBack_Gold_high : WelcomeBack_Gold_low;
	}

	public static string AddBonusReferalOrigin(PlayerAccount _007B3742_007D, DateTime _007B3743_007D)
	{
		_007B3742_007D.Shipyard.CurrentRealShip.PrivateResourcesOfHold.AddOrRemove(37, 300);
		_007B3742_007D.AddPremium(7.0, _007B3743_007D);
		_007B3742_007D.Analytics.InvitedReferals++;
		string text = string.Empty;
		if (_007B3742_007D.Analytics.InvitedReferals == 10)
		{
			_007B3742_007D.DesingElementsAtStorage[419] += 5;
			text = Local.referal_bonus_many(10);
		}
		else if (_007B3742_007D.Analytics.InvitedReferals == 30)
		{
			_007B3742_007D.Monets.Value += 1000;
			_007B3742_007D.Achievements.AddSingle(AchievementEnum.ManyFriendsReferal);
			text = Local.referal_bonus_many(30);
		}
		return Local.referal_bonus1(7, 300) + text;
	}

	public static string AddBonusReferalInvited(PlayerAccount _007B3744_007D, DateTime _007B3745_007D)
	{
		_007B3744_007D.MaxShipsCount.Value += ReferalBonusExtraShips;
		_007B3744_007D.AddPremium(ReferalBonusExtraPremium, _007B3745_007D);
		return Local.referal_bonus2(ReferalBonusExtraShips, ReferalBonusExtraPremium);
	}

	public static int CostResetCaptainSkillGold(PlayerAccount _007B3746_007D)
	{
		return (_007B3746_007D.Rang < 5) ? 250 : ((_007B3746_007D.Rang < 10) ? 1000 : ((_007B3746_007D.Rang < 15) ? 4000 : ((_007B3746_007D.Rang < 20) ? 7000 : 10000)));
	}

	public static int PlaceForShipCostVSkull(PlayerAccount _007B3747_007D)
	{
		int num = _007B3747_007D.MaxShipsCount.Value - InitialPlacesForShips.Value;
		return 12 + num + Math.Max(0, num - 30);
	}

	public static int WorldTravelPrice(PlayerAccount _007B3748_007D, bool _007B3749_007D)
	{
		return (100 + _007B3748_007D.Rang * 40) * ((!_007B3749_007D) ? 1 : 3);
	}

	public static int MinRankEnteringGuild(bool _007B3750_007D)
	{
		return (!_007B3750_007D) ? 10 : 0;
	}

	public static float GuildTopPoistionFactor(float _007B3751_007D, int _007B3752_007D)
	{
		float num = 1f;
		float num2 = 0.5f;
		float num3 = MathF.Pow(_007B3751_007D, 0.5f);
		float val = Geometry.Saturate(num3) * (num - num2) + num2;
		float val2 = Geometry.Saturate((float)_007B3752_007D / 600f);
		return Math.Max(val, val2);
	}

	public static void DefaultGetDebrisInShip(GSI _007B3753_007D, float _007B3754_007D, float _007B3755_007D, bool _007B3756_007D)
	{
		_007B3753_007D.Exs(20, Rand.Round(1f + Math.Min(3200f, _007B3754_007D) / (_007B3756_007D ? 400f : 200f)));
	}

	public static DropBonusInfo ShipFloodingDropPlayer(Player _007B3757_007D, Func<(GSI res, GSI balls)> _007B3758_007D, byte _007B3759_007D = byte.MaxValue)
	{
		GSI gSI = new GSI();
		GSI gSI2 = new GSI();
		DefaultGetDebrisInShip(gSI, _007B3757_007D.UsedShipPlayer.MaxHp, _007B3757_007D.UsedShipPlayer.FirstSailHP, _007B3756_007D: false);
		if (_007B3757_007D.MapInfo.IsWorldmap && _007B3757_007D.UsedShipPlayer.CraftFrom.MaxIntegrity != -1 && _007B3757_007D.UsedShipPlayer.Integrity > 0)
		{
			gSI.AddOrRemove(1, Rand.Round(_007B3757_007D.UsedShip.MaxHp / 25f));
		}
		(GSI, GSI) tuple = _007B3758_007D();
		gSI.Add(tuple.Item1);
		gSI2.Add(tuple.Item2);
		DropBonusInfo result = new DropBonusInfo(0, gSI2, gSI);
		result.PowerupItemIDindex = _007B3759_007D;
		return result;
	}

	internal static float ComputeBasicBonus(float _007B3760_007D, float _007B3761_007D, float _007B3762_007D)
	{
		return _007B3760_007D / 8f * (1f + (_007B3762_007D - 1f) / 11f + _007B3761_007D / 150f);
	}

	public static int GetPbsFactoryAmount(int _007B3763_007D, bool _007B3764_007D, ResourceInfo _007B3765_007D)
	{
		if (1 == 0)
		{
		}
		int num = _007B3763_007D switch
		{
			1 => 5000, 
			2 => 5500, 
			3 => 6050, 
			4 => 7950, 
			5 => 8000, 
			6 => 10000, 
			7 => 12500, 
			_ => throw new ArgumentException("portLevel"), 
		};
		if (1 == 0)
		{
		}
		int num2 = num;
		ResourceInfo resourceInfo = ItemsInfo.FromID(39);
		float num3 = _007B3765_007D.MediumCost.Value;
		if (_007B3765_007D.ID == 5)
		{
			num3 += 1f;
		}
		int num4 = (int)Math.Round((float)num2 / num3);
		if (_007B3764_007D)
		{
			num4 = num4 * 3 / 2;
		}
		return num4;
	}

	internal static int roundHelper(float _007B3766_007D)
	{
		if (_007B3766_007D > 1000f)
		{
			return (int)Math.Round(_007B3766_007D / 10f) * 10;
		}
		if (_007B3766_007D > 40f)
		{
			return (int)Math.Round(_007B3766_007D / 5f) * 5;
		}
		return (int)Math.Round(_007B3766_007D);
	}

	public static void DisplayNpcs()
	{
		StringBuilder stringBuilder = new StringBuilder();
		foreach (NpcInfo item in (IEnumerable<NpcInfo>)NpcsInfo)
		{
			if (item.Descritpion == NpcType.Empire_Legendary3l)
			{
				stringBuilder.AppendLine(" ");
				stringBuilder.AppendLine(item.NpcName);
				StringBuilder stringBuilder2 = stringBuilder;
				StringBuilder stringBuilder3 = stringBuilder2;
				StringBuilder.AppendInterpolatedStringHandler handler = new StringBuilder.AppendInterpolatedStringHandler(16, 1, stringBuilder2);
				handler.AppendLiteral("   Total count: ");
				handler.AppendFormatted(item.Generation);
				stringBuilder3.AppendLine(ref handler);
				stringBuilder2 = stringBuilder;
				StringBuilder stringBuilder4 = stringBuilder2;
				handler = new StringBuilder.AppendInterpolatedStringHandler(15, 1, stringBuilder2);
				handler.AppendLiteral("   Fleet size: ");
				handler.AppendFormatted(item.FleetSize);
				stringBuilder4.AppendLine(ref handler);
				stringBuilder2 = stringBuilder;
				StringBuilder stringBuilder5 = stringBuilder2;
				handler = new StringBuilder.AppendInterpolatedStringHandler(9, 1, stringBuilder2);
				handler.AppendLiteral("   Ship: ");
				handler.AppendFormatted(item.BasedOn.ShipName);
				stringBuilder5.AppendLine(ref handler);
				stringBuilder2 = stringBuilder;
				StringBuilder stringBuilder6 = stringBuilder2;
				handler = new StringBuilder.AppendInterpolatedStringHandler(7, 1, stringBuilder2);
				handler.AppendLiteral("   HP: ");
				handler.AppendFormatted(item.ShipProperties.MaxHp);
				stringBuilder6.AppendLine(ref handler);
				stringBuilder2 = stringBuilder;
				StringBuilder stringBuilder7 = stringBuilder2;
				handler = new StringBuilder.AppendInterpolatedStringHandler(10, 1, stringBuilder2);
				handler.AppendLiteral("   Speed: ");
				handler.AppendFormatted(item.ShipProperties.MaxBasicSpeed);
				stringBuilder7.AppendLine(ref handler);
				stringBuilder2 = stringBuilder;
				StringBuilder stringBuilder8 = stringBuilder2;
				handler = new StringBuilder.AppendInterpolatedStringHandler(11, 1, stringBuilder2);
				handler.AppendLiteral("   Damage: ");
				handler.AppendFormatted(item.DamagePerShot);
				stringBuilder8.AppendLine(ref handler);
				stringBuilder2 = stringBuilder;
				StringBuilder stringBuilder9 = stringBuilder2;
				handler = new StringBuilder.AppendInterpolatedStringHandler(13, 1, stringBuilder2);
				handler.AppendLiteral("   Cooldown: ");
				handler.AppendFormatted(item.ReloadCannonTime / 1000f, "F0");
				stringBuilder9.AppendLine(ref handler);
				stringBuilder2 = stringBuilder;
				StringBuilder stringBuilder10 = stringBuilder2;
				handler = new StringBuilder.AppendInterpolatedStringHandler(10, 1, stringBuilder2);
				handler.AppendLiteral("   Armor: ");
				handler.AppendFormatted(item.ShipProperties.Armor);
				stringBuilder10.AppendLine(ref handler);
				stringBuilder2 = stringBuilder;
				StringBuilder stringBuilder11 = stringBuilder2;
				handler = new StringBuilder.AppendInterpolatedStringHandler(20, 1, stringBuilder2);
				handler.AppendLiteral("   Attack distance: ");
				handler.AppendFormatted(item.AttackDistance);
				stringBuilder11.AppendLine(ref handler);
			}
		}
		File.WriteAllText("temp.txt", stringBuilder.ToString());
		Engine.ShowTextFile("temp.txt");
	}

	public static void DisplayQuests()
	{
		//IL_00aa: Unknown result type (might be due to invalid IL or missing references)
		StringBuilder stringBuilder = new StringBuilder();
		foreach (QuestInfo item in (IEnumerable<QuestInfo>)QuestsInfo)
		{
			stringBuilder.AppendLine();
			StringBuilder stringBuilder2 = stringBuilder;
			StringBuilder stringBuilder3 = stringBuilder2;
			StringBuilder.AppendInterpolatedStringHandler handler = new StringBuilder.AppendInterpolatedStringHandler(7, 4, stringBuilder2);
			handler.AppendLiteral("[");
			handler.AppendFormatted(item.ID);
			handler.AppendLiteral("] ");
			handler.AppendFormatted(item.QuestShortName);
			handler.AppendLiteral(" (");
			handler.AppendFormatted(item.LocationPort?.PortName ?? "-");
			handler.AppendLiteral(") ");
			handler.AppendFormatted<Vector2>(item.LocationPos);
			stringBuilder3.AppendLine(ref handler);
			foreach (QuestStepHeader item2 in (IEnumerable<QuestStepHeader>)item.Steps)
			{
				stringBuilder2 = stringBuilder;
				StringBuilder stringBuilder4 = stringBuilder2;
				handler = new StringBuilder.AppendInterpolatedStringHandler(3, 1, stringBuilder2);
				handler.AppendLiteral("   ");
				handler.AppendFormatted(item2.TextWhatToDo);
				stringBuilder4.AppendLine(ref handler);
			}
		}
		File.WriteAllText("temp.txt", stringBuilder.ToString());
		Engine.ShowTextFile("temp.txt");
	}

	public static void DisplayAllData()
	{
		//IL_066d: Unknown result type (might be due to invalid IL or missing references)
		//IL_0672: Unknown result type (might be due to invalid IL or missing references)
		//IL_0677: Unknown result type (might be due to invalid IL or missing references)
		//IL_067c: Unknown result type (might be due to invalid IL or missing references)
		//IL_0686: Unknown result type (might be due to invalid IL or missing references)
		//IL_068b: Unknown result type (might be due to invalid IL or missing references)
		//IL_0690: Unknown result type (might be due to invalid IL or missing references)
		//IL_06a7: Unknown result type (might be due to invalid IL or missing references)
		StringBuilder builder = new StringBuilder();
		Header("WORLD METRICS");
		Tlist<(IslePortInfo, IslePortInfo)> tlist = new Tlist<(IslePortInfo, IslePortInfo)>();
		for (int i = 0; i < WorldMap.Ports.Size; i++)
		{
			for (int j = i + 1; j < WorldMap.Ports.Size; j++)
			{
				tlist.Add((WorldMap.Ports.Array[i], WorldMap.Ports.Array[j]));
			}
		}
		float[] source = tlist.Select(((IslePortInfo, IslePortInfo) _007B3778_007D) => Vector2.Distance(_007B3778_007D.Item1.EntryPos, _007B3778_007D.Item2.EntryPos)).ToArray();
		float num = source.Min();
		float num2 = source.Max();
		float num3 = source.Average();
		builder.AppendLine("Avg dist: " + (int)num3);
		builder.AppendLine("Avg time to travel: " + (int)CommonSupport.MiddleSailingTime(21f, num3) + " sec");
		StringBuilder stringBuilder = builder;
		StringBuilder.AppendInterpolatedStringHandler handler = new StringBuilder.AppendInterpolatedStringHandler(15, 2, stringBuilder);
		handler.AppendLiteral("Dist range: ");
		handler.AppendFormatted((int)num);
		handler.AppendLiteral(" - ");
		handler.AppendFormatted((int)num2);
		stringBuilder.AppendLine(ref handler);
		Header("SHIP UPGRADES NEW (rank 1)");
		foreach (ShipUpgradeInfo item2 in (IEnumerable<ShipUpgradeInfo>)ShipUpgradesInfo)
		{
			string text = "";
			foreach (ShipBonus effect in item2.GetEffects(null))
			{
				text = text + effect.ToString() + ";";
			}
			builder.AppendLine(item2.ID.ToString().PadRight(5) + item2.Name.PadRight(30) + text.PadRight(55) + ((item2.MainCraftResDsiplay != null) ? item2.MainCraftResDsiplay.Name : "-"));
		}
		Header("PASSING MAPS");
		foreach (MapForPassingInfo item3 in (IEnumerable<MapForPassingInfo>)MapsForPassing)
		{
			builder.AppendLine(item3.Name);
			int num4 = item3.WavesNPCS.Sum((PassingMapNpcWaveInfo _007B3779_007D) => _007B3779_007D.WaveInfo.Sum((NpcWaveInfo _007B3780_007D) => _007B3780_007D.Info.RewardAmount.GoldBonus * _007B3780_007D.Count));
			int num5 = item3.WavesNPCS.Sum((PassingMapNpcWaveInfo _007B3781_007D) => _007B3781_007D.WaveInfo.Sum((NpcWaveInfo _007B3782_007D) => _007B3782_007D.Info.RewardAmount.XpBonus * _007B3782_007D.Count));
			builder.AppendLine("gold: " + num4);
			builder.AppendLine("xp: " + num5);
		}
		Header("MINES & FACTORIES");
		foreach (KeyValuePair<FactoryType, FactoryGameInfo> item4 in WosbCrafting.FactoriesInfo)
		{
			builder.AppendLine(item4.Value.Name);
			FactoryMineLivelInfo[] levels = item4.Value.Levels;
			foreach (FactoryMineLivelInfo factoryMineLivelInfo in levels)
			{
				builder.AppendLine("  produce " + factoryMineLivelInfo.DisplayOutputRes.Name + " x" + factoryMineLivelInfo.ProducedResCount + ", uses " + ItemsInfo.FromID(factoryMineLivelInfo.ConsumedResId).Name + " x" + factoryMineLivelInfo.ConsumedResCount);
			}
			FactoryMineLivelInfo factoryMineLivelInfo2 = item4.Value.Levels[item4.Value.Levels.Length - 1];
			builder.AppendLine("  full-loot cargo: " + factoryMineLivelInfo2.DisplayOutputRes.Mass * factoryMineLivelInfo2.HoldCapacityBasic);
		}
		Header("WEIGHT AND COST OF RESOURCES");
		builder.AppendLine("Название | Вес | Цена");
		foreach (ResourceInfo resInfo in (IEnumerable<ResourceInfo>)ItemsInfo)
		{
			builder.AppendLine(resInfo.Name.PadRight(30) + resInfo.Mass.ToString().PadRight(10) + resInfo.MediumCost.Value);
			WosbCrafting.Recepie recepie = WosbCrafting.Workshop.FirstOrDefault((WosbCrafting.Recepie _007B3796_007D) => _007B3796_007D.outputItemId.Value != 255 && _007B3796_007D.Output.getType == StorageAssetEnum.SimpleItem && _007B3796_007D.outputItemId.Value == resInfo.ID);
			if (recepie != null)
			{
				float num7 = recepie.Craft.InputItems.ComputeMass<ResourceInfo>();
				int num8 = recepie.Craft.InputItems.TotalPrice();
				builder.AppendLine("   вес и цена: ".PadRight(30) + num7.ToString().PadRight(10) + num8);
			}
		}
		Header("NPCS-METRICS");
		foreach (WorldMapRegionInfo item in (IEnumerable<WorldMapRegionInfo>)WorldMap.RegionsInfo)
		{
			int num9 = NpcsInfo.Count((NpcInfo _007B3797_007D) => _007B3797_007D.Location.HzLevel == item.LevelInt);
			int num10 = 0;
			float num11 = 150f;
			for (int num12 = 0; (float)num12 < num11; num12++)
			{
				for (int num13 = 0; (float)num13 < num11; num13++)
				{
					Vector2 _007B3640_007D = new Vector2((float)num12 / num11, (float)num13 / num11) * WorldMapSizeXY - WorldMapSizeXY / 2f;
					if (GetNearWorldRegion(in _007B3640_007D) == item && WorldMap.CheckPosition(_007B3640_007D))
					{
						num10++;
					}
				}
			}
			builder.AppendLine("Area " + item.ID + ", count npc: " + num9 + ", square: " + num10);
		}
		Header("NPCS");
		Tlist<string> tlist2 = new Tlist<string>();
		builder.AppendLine("Level".PadRight(10) + "Prototype".PadRight(20) + "HP".PadRight(10) + "Speed".PadRight(10) + "Armor".PadRight(10) + "DPM".PadRight(10) + "Ship");
		foreach (NpcInfo item5 in NpcsInfo.OrderBy((NpcInfo _007B3783_007D) => (float)_007B3783_007D.Location.HzLevel + (float)_007B3783_007D.Descritpion / 100f))
		{
			if (item5.Descritpion != NpcType.SpecialNoReward)
			{
				builder.AppendLine(item5.Location.ToString().PadRight(10) + item5.BasedOn.ShipName.PadRight(20) + item5.ShipProperties.MaxHp.ToString().PadRight(10) + Math.Round(item5.ShipProperties.MaxBasicSpeed, 1).ToString().PadRight(10) + Math.Round(item5.ShipProperties.Armor, 1).ToString().PadRight(10) + ((int)(item5.DamagePerShot * 60f / (item5.ReloadCannonTime / 1000f)) + " / " + item5.AttackDistance).PadRight(10) + shipName(item5.Ship.ID).PadRight(20) + item5.Descritpion.ToString().PadRight(30) + item5.NpcName);
			}
		}
		Header("DELIVERY QUESTS");
		foreach (WorldMapRegionInfo item6 in (IEnumerable<WorldMapRegionInfo>)WorldMap.RegionsInfo)
		{
			builder.AppendLine();
			builder.AppendLine("Level: " + item6.LevelInt);
			foreach (IslePortInfo item7 in (IEnumerable<IslePortInfo>)WorldMap.Ports)
			{
				if (item7.NearRegion != item6)
				{
					continue;
				}
				foreach (QuestInfo item8 in (IEnumerable<QuestInfo>)QuestsInfo)
				{
					if (item8.LocationPort == item7 && item8.FirstStep is QuestTransferOrder questTransferOrder)
					{
						StringBuilder stringBuilder2 = builder;
						string[] obj = new string[6]
						{
							questTransferOrder.IsSmuggling ? "smug " : "     ",
							("weight: " + (int)questTransferOrder.Mass).PadRight(15),
							("dist: " + (int)questTransferOrder.SailingDistance).PadRight(15),
							null,
							null,
							null
						};
						string text2 = item8.Bonus.Gold.Value.ToString();
						RTI xp = item8.Bonus.Xp;
						obj[3] = ("reward: " + text2 + ", xp: " + xp.ToString()).PadRight(25);
						obj[4] = "haz: ";
						obj[5] = item8.HardnessLevel.ToString();
						stringBuilder2.AppendLine(string.Concat(obj));
					}
				}
			}
		}
		Header("PORT QUESTS");
		builder.AppendLine();
		IOrderedEnumerable<QuestInfo> orderedEnumerable = from _007B3785_007D in QuestsInfo
			where _007B3785_007D.LocationPort != null
			orderby _007B3785_007D.LocationPort.NearRegion
			select _007B3785_007D;
		foreach (QuestInfo item9 in orderedEnumerable)
		{
			if (item9.LocationPort == null || item9.FirstStep is QuestTransferOrder)
			{
				continue;
			}
			string text3 = "";
			foreach (QuestStepHeader item10 in (IEnumerable<QuestStepHeader>)item9.Steps)
			{
				text3 = text3 + item10.ToString() + "; ";
			}
			builder.AppendLine(("Zone " + item9.LocationPort.NearRegion?.ToString() + ", Name " + item9.QuestShortName).PadRight(40) + ("Reward gold " + item9.Bonus.Gold.Value + " xp " + item9.Bonus.Xp.Value + " items " + item9.Bonus.Items.GetTotalItemsCount() + " K:" + ((object)Unsafe.As<Vector2, Vector2>(ref item9.LocationPos)/*cast due to .constrained prefix*/).GetHashCode()).PadRight(40) + text3);
		}
		Header("RESOURCES");
		foreach (ResourceInfo item11 in (IEnumerable<ResourceInfo>)ItemsInfo)
		{
			builder.AppendLine(item11.ID.ToString().PadRight(4) + item11.Name.PadRight(30) + (item11.MediumCost.Value + "g").PadRight(11) + (item11.Mass + "w").PadRight(11) + item11.AllowStorage);
		}
		Header("ECONOMY");
		builder.AppendLine("Потребление ресурсов для кораблей");
		ScoreDictionary<int> scoreDictionary = new ScoreDictionary<int>();
		int num14 = 0;
		int num15 = 0;
		foreach (PlayerShipInfo item12 in (IEnumerable<PlayerShipInfo>)PlayersInfo)
		{
			if (item12.Coolness != PlayerShipCoolness.Default)
			{
				continue;
			}
			num15++;
			num14 += item12.StaticInfo.Ports.Length;
			foreach (GSILocalPair item13 in (IEnumerable<GSILocalPair>)item12.CraftCostDefault)
			{
				scoreDictionary.AddScore(item13.ID, item13.Count);
			}
		}
		foreach (KeyValuePair<int, float> item14 in scoreDictionary.BaseDictionary.OrderBy((KeyValuePair<int, float> _007B3786_007D) => _007B3786_007D.Value))
		{
			builder.AppendLine(ItemsInfo.FromID(item14.Key).Name.PadRight(20) + item14.Value);
		}
		builder.AppendLine("Потребление сырья для кораблей");
		ScoreDictionary<int> scoreDictionary2 = unrollCrafts(scoreDictionary);
		foreach (KeyValuePair<int, float> item15 in scoreDictionary2.BaseDictionary.OrderBy((KeyValuePair<int, float> _007B3787_007D) => _007B3787_007D.Value))
		{
			builder.AppendLine(ItemsInfo.FromID(item15.Key).Name.PadRight(20) + item15.Value);
		}
		scoreDictionary.Clear();
		builder.AppendLine("Потребление ресурсов для пушек на все эти корабли");
		float num16 = CannonsGameInfo.Count((CannonGameInfo _007B3788_007D) => _007B3788_007D.CraftingType == ShipCannonCrafting.ByCraft);
		foreach (CannonGameInfo item16 in (IEnumerable<CannonGameInfo>)CannonsGameInfo)
		{
			if (item16.CraftingType != ShipCannonCrafting.ByCraft)
			{
				continue;
			}
			foreach (GSILocalPair item17 in (IEnumerable<GSILocalPair>)item16.Craft.InputItems)
			{
				scoreDictionary.AddScore(item17.ID, (float)(item17.Count * num14) / num16);
			}
			scoreDictionary.AddScore(24, item16.Craft.InputMoney.Value);
		}
		foreach (KeyValuePair<int, float> item18 in scoreDictionary.BaseDictionary.OrderBy((KeyValuePair<int, float> _007B3789_007D) => _007B3789_007D.Value))
		{
			builder.AppendLine(ItemsInfo.FromID(item18.Key).Name.PadRight(20) + item18.Value);
		}
		builder.AppendLine("Потребление сырья для пушек на все эти корабли");
		scoreDictionary2 = unrollCrafts(scoreDictionary);
		foreach (KeyValuePair<int, float> item19 in scoreDictionary2.BaseDictionary.OrderBy((KeyValuePair<int, float> _007B3790_007D) => _007B3790_007D.Value))
		{
			builder.AppendLine(ItemsInfo.FromID(item19.Key).Name.PadRight(20) + item19.Value);
		}
		scoreDictionary.Clear();
		builder.AppendLine("Потребление ресурсов для 4-х апгрейдов на все эти корабли");
		float num17 = 4f / (float)ShipUpgradesInfo.Count;
		foreach (ShipUpgradeInfo item20 in (IEnumerable<ShipUpgradeInfo>)ShipUpgradesInfo)
		{
			foreach (PlayerShipInfo item21 in (IEnumerable<PlayerShipInfo>)PlayersInfo)
			{
				if (item21.Coolness != PlayerShipCoolness.Default)
				{
					continue;
				}
				CraftingRecipe craft = item20.GetCraft(item21, null, _007B2621_007D: false);
				foreach (GSILocalPair item22 in (IEnumerable<GSILocalPair>)craft.InputItems)
				{
					scoreDictionary.AddScore(item22.ID, (float)item22.Count * num17);
				}
				scoreDictionary.AddScore(24, craft.InputMoney.Value);
			}
		}
		foreach (KeyValuePair<int, float> item23 in scoreDictionary.BaseDictionary.OrderBy((KeyValuePair<int, float> _007B3791_007D) => _007B3791_007D.Value))
		{
			builder.AppendLine(ItemsInfo.FromID(item23.Key).Name.PadRight(20) + (int)item23.Value);
		}
		builder.AppendLine("Потребление сырья для апгрейдов на все эти корабли");
		scoreDictionary2 = unrollCrafts(scoreDictionary);
		foreach (KeyValuePair<int, float> item24 in scoreDictionary2.BaseDictionary.OrderBy((KeyValuePair<int, float> _007B3792_007D) => _007B3792_007D.Value))
		{
			builder.AppendLine(ItemsInfo.FromID(item24.Key).Name.PadRight(20) + (int)item24.Value);
		}
		File.WriteAllText("temp.txt", builder.ToString());
		Engine.ShowTextFile("temp.txt");
		void Header(string _007B3767_007D)
		{
			builder.AppendLine("");
			builder.AppendLine("==========================================");
			builder.AppendLine("              " + _007B3767_007D);
			builder.AppendLine("==========================================");
		}
		static string shipName(int _007B3769_007D)
		{
			foreach (PlayerShipInfo item25 in (IEnumerable<PlayerShipInfo>)PlayersInfo)
			{
				if (item25.StaticInfo.ID == _007B3769_007D)
				{
					return item25.ShipName + ":" + _007B3769_007D;
				}
			}
			return "?";
		}
		static ScoreDictionary<int> unrollCrafts(ScoreDictionary<int> _007B3770_007D)
		{
			ScoreDictionary<int> scoreDictionary3 = new ScoreDictionary<int>();
			foreach (KeyValuePair<int, float> item26 in _007B3770_007D.BaseDictionary)
			{
				bool flag = false;
				WosbCrafting.Recepie[] workshop = WosbCrafting.Workshop;
				foreach (WosbCrafting.Recepie recepie2 in workshop)
				{
					if (recepie2.outputType == StorageAssetEnum.SimpleItem && recepie2.outputItemId.Value == item26.Key)
					{
						foreach (GSILocalPair item27 in (IEnumerable<GSILocalPair>)recepie2.Craft.InputItems)
						{
							scoreDictionary3.AddScore(item27.ID, (float)item27.Count / (float)recepie2.OutputItemCount.Value * item26.Value);
						}
						flag = true;
						break;
					}
				}
				if (!flag)
				{
					scoreDictionary3.AddScore(item26.Key, item26.Value);
				}
			}
			return scoreDictionary3;
		}
	}
}
