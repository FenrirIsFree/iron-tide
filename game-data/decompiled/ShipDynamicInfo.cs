using System;
using Common.Game;
using Microsoft.Xna.Framework;
using TheraEngine.Collections;
using TheraEngine.Helpers;

namespace Common.Resources;

public abstract class ShipDynamicInfo
{
	public readonly ShipStaticInfo StaticInfo;

	internal DynamicEffectHelper DynamicBonus;

	public UnitCollection Crew;

	internal ShipFirstHp firstHP;

	public Map<CannonGameInstance> Mortars;

	public CannonCollection Cannons;

	protected internal float hpFactorCached;

	public readonly float[] HitboxSailsStrength;

	private float _007B2828_007D;

	public ShipFirstHp FirstHP => firstHP;

	public float HpFactor => firstHP.Summary / MaxHp;

	public byte CompressedHP => HashHelper.FloatToByte(firstHP.Summary / MaxHp);

	public int DynamicEffectsCount => DynamicBonus.Count;

	public float FirstSailHP => _007B2828_007D;

	public bool IsSailesFull => _007B2828_007D >= 0.99994f;

	public virtual float MaxHp => (int)(BasicHp * (1f + GetBonus(ShipBonusEffect.PHealth)) + GetBonus(ShipBonusEffect.MHealth));

	public float MaxHpWithoutTempEffects => (int)(BasicHp * (1f + GetBonus(ShipBonusEffect.PHealth, _007B2824_007D: false)) + GetBonus(ShipBonusEffect.MHealth, _007B2824_007D: false));

	public float Speed => BasicSpeed * (1f + GetBonus(ShipBonusEffect.PSpeed)) + GetBonus(ShipBonusEffect.MSpeed);

	public float SpeedWithoutTempEffects => BasicSpeed * (1f + GetBonus(ShipBonusEffect.PSpeed, _007B2824_007D: false)) + GetBonus(ShipBonusEffect.MSpeed, _007B2824_007D: false);

	public float Armor => BasicArmor * (1f + GetBonus(ShipBonusEffect.PArmor)) + GetBonus(ShipBonusEffect.MArmor);

	public float ArmorWithoutTempEffects => BasicArmor * (1f + GetBonus(ShipBonusEffect.PArmor, _007B2824_007D: false)) + GetBonus(ShipBonusEffect.MArmor, _007B2824_007D: false);

	public float Mobility => (BasicMobility + GetBonus(ShipBonusEffect.MMobilityBonus) + GetBonus(ShipBonusEffect.PMobilityBonus) * BasicMobility + ((hpFactorCached < 0.5f) ? MobilityWithLowHp : 0f)) * ((FirstSailHP < 0.95f) ? MathHelper.Lerp(0.8f, 1f, Geometry.Saturate((FirstSailHP - 0.8f) / 0.15f)) : 1f);

	public float MobilityWithoutTempEffects => BasicMobility + GetBonus(ShipBonusEffect.MMobilityBonus, _007B2824_007D: false) + GetBonus(ShipBonusEffect.PMobilityBonus, _007B2824_007D: false) * BasicMobility;

	public float Capacity => (int)(BasicCapacity * (1f + GetBonus(ShipBonusEffect.PCapacity, _007B2824_007D: false)) + GetBonus(ShipBonusEffect.MCapacity, _007B2824_007D: false));

	public int CrewPlaces => BasicCrewPlaces + (int)GetBonus(ShipBonusEffect.MExtraPlaces, _007B2824_007D: false);

	public int NeedSailors => BasicCrewPlaces / 2;

	public int NeedBoarding => BasicCrewPlaces - NeedSailors;

	public float CrewFactor => Math.Min(1f, (float)Crew.Count / (float)CrewPlaces);

	public float CannonsReloadSpeedBonus => GetBonus(ShipBonusEffect.PCannonsReload) + ((hpFactorCached < 0.5f) ? GetBonus(ShipBonusEffect.PCannonsReloadWithLowHp) : 0f);

	public float DamageBonusForCollision => GetBonus(ShipBonusEffect.PAddCollisionDamage);

	public float BallDamageBonusToAll => GetBonus(ShipBonusEffect.PBallDamage) + DamageUpIfStrengthBefore30pNow;

	public float BallDistanceBonusValue => Math.Min(15f, GetBonus(ShipBonusEffect.MCannonsDistance));

	public float WeaponPenetrationBonus => GetBonus(ShipBonusEffect.MWeaponPenetration);

	public float CannonBallSpeedFactor => 1f + GetBonus(ShipBonusEffect.PCannonBallsSpeed);

	public float FalkonetReloadBonus => GetBonus(ShipBonusEffect.PFalkonetReloadBoost);

	public float MortarDamagBonus => GetBonus(ShipBonusEffect.PMortarDamageBonus);

	public float MortarDamageToSailFactor => Math.Max(0f, 1f - GetBonus(ShipBonusEffect.PSailProtection));

	public float MortarMaxDistanceBonus => GetBonus(ShipBonusEffect.MMortarMaxDistance);

	public float MortarReloadBonus => GetBonus(ShipBonusEffect.PMortarReload) + (Cannons.IsAllReloadedApprox ? GetBonus(ShipBonusEffect.PMortarReloadWhenCannonsAreReloaded) : 0f);

	public float FireAreaDamageFactor => Math.Max(0.01f, 1f - GetBonus(ShipBonusEffect.PReduceFireAreaDamage));

	public float DamageToSailFromBurningFactor => 1f - GetBonus(ShipBonusEffect.PReduceDamageToSailFromBurning);

	public float BallDamageBonusToBuilds => GetBonus(ShipBonusEffect.PDamageToBuilds) + DamageUpIfStrengthBefore30pNow;

	public float ViewDistanceMultiplier => 1f + GetBonus(ShipBonusEffect.PVisibilityZone);

	internal float DamageReduce => Math.Min(0.99f, GetBonus(ShipBonusEffect.PReduceDamage));

	public float PowderKegReloadBoost => GetBonus(ShipBonusEffect.PPowderKegReloadBoost);

	public float ChangeCBallsBonus => GetBonus(ShipBonusEffect.PChangeCBallsSpeed);

	public float CannonsAxisBonusRad => MathHelper.ToRadians(GetBonus(ShipBonusEffect.MCannonsAngleBonus));

	public float ReduceAnyDamageFromMorar => GetBonus(ShipBonusEffect.PReduceReceivesMortarDamage);

	public float MendingEffectivityAdd => GetBonus(ShipBonusEffect.PMendingEffectivity);

	public float ReduceLossesWhenKilled => GetBonus(ShipBonusEffect.PReduceLossesWhenKilled);

	public float FrontAndBackWeaponsDamageBonus => GetBonus(ShipBonusEffect.PFrontAndBackCannonsAddDamage);

	public virtual float PlayerXpAndRewardBonus => GetBonus(ShipBonusEffect.PServer_XpAndRewardBonus);

	public float ReduceSouringItems => GetBonus(ShipBonusEffect.PSouredItemsReduce);

	public float ReduceDamageToNose => GetBonus(ShipBonusEffect.PReduceDamageToNose);

	public float DamageUpIfStrengthBefore30pNow => (firstHP.Summary / MaxHp < 0.5f) ? GetBonus(ShipBonusEffect.PDamageCannonIfStrengthBelow30P) : 0f;

	public float SightFocusSpeedAdd => GetBonus(ShipBonusEffect.PPlayerSightFocusSpeedAdd);

	public float PowderKegProtection => GetBonus(ShipBonusEffect.PReducePowderKegDamage);

	public float BoardingGoldAmount => GetBonus(ShipBonusEffect.PBoardingGold);

	public float DropCannonsQuantityMultiplier => GetBonus(ShipBonusEffect.PImproveQuantityOfDropCannons) + 1f;

	public bool DestroyFloodingShipByCollision => GetBonus(ShipBonusEffect.BDestroyFloodingShopByCollision) > 0f;

	public float FishingSpeedBonus => GetBonus(ShipBonusEffect.PFishingSpeed);

	public float ReduceCannonsScatter => GetBonus(ShipBonusEffect.PReduceCannonsScatter);

	public virtual bool HasExtraMortarUpgrade => GetBonus(ShipBonusEffect.BExtraMortars, _007B2824_007D: false) > 0f;

	public bool BoardingStartsMusketeersDefence => GetBonus(ShipBonusEffect.BBoardingStartsMusketeersDefence, _007B2824_007D: false) >= 1f;

	public float BigFireFightingSpeed => 1f + GetBonus(ShipBonusEffect.PBigFireFightingSpeed, _007B2824_007D: false);

	public float BigFireDamageFactor => Math.Max(0.001f, 1f - GetBonus(ShipBonusEffect.PReduceBigFireDamage, _007B2824_007D: false));

	public float MicrofireDurationFactor => Math.Max(0.001f, 1f - GetBonus(ShipBonusEffect.PMicrofireFightingSpeed));

	public bool HealRandomUnitsWhenMending => GetBonus(ShipBonusEffect.BHealUnitsWhenMending, _007B2824_007D: false) >= 1f;

	public float CrewFineReduce => GetBonus(ShipBonusEffect.PCrewFineReduce);

	public float ReloadingBonusAfterSingleShot => GetBonus(ShipBonusEffect.PReloadingAfterSingleShot, _007B2824_007D: false);

	public float MortarAimingSpeed => 1.1f - (float)(StaticInfo.MortarPorts.Length + (HasExtraMortarUpgrade ? 1 : 0)) * 0.1f + GetBonus(ShipBonusEffect.PMortarAimSpeed, _007B2824_007D: false) + GetBonus(ShipBonusEffect.PPlayerSightFocusSpeedAdd, _007B2824_007D: false);

	public float MobilityBonusAtLowSpeeds => GetBonus(ShipBonusEffect.MMobility0And1, _007B2824_007D: false) / 100f;

	public virtual float MobilityWithLowHp => GetBonus(ShipBonusEffect.MMobilityWithLowHp, _007B2824_007D: false);

	public float SailRepairSpeed => 1f + GetBonus(ShipBonusEffect.PSailAutoRepairSpeed, _007B2824_007D: false);

	public bool CanRepairWithSpeed2 => GetBonus(ShipBonusEffect.BRepairAllowOnSpeed2, _007B2824_007D: false) >= 1f;

	public float OverweightFineReduce => GetBonus(ShipBonusEffect.POverweightFineReduce, _007B2824_007D: false);

	public bool AllowEatAnimals => GetBonus(ShipBonusEffect.BAllowConsumeAnimalsToFood, _007B2824_007D: false) >= 1f;

	public float FoodValueBonus => GetBonus(ShipBonusEffect.PFoodValueBonus, _007B2824_007D: false);

	public float CannonWearFactor => 1f - GetBonus(ShipBonusEffect.PReduceCannonsWear, _007B2824_007D: false);

	public float FishingProfitBonus => GetBonus(ShipBonusEffect.PFishingProfit, _007B2824_007D: false);

	public virtual float PlayerXpOnlyBonus => GetBonus(ShipBonusEffect.PXpBonus);

	public virtual float PlayerXpBonusUpgradesAndBranch => GetBonus(ShipBonusEffect.PXpBonusUpgradesAndBranch);

	public float MinimapLootVisibleDistanceFactor => 1f + GetBonus(ShipBonusEffect.PMinimapLootVisibleDistance, _007B2824_007D: false);

	public bool BoardingStartsWithNoTarget => GetBonus(ShipBonusEffect.BBoardingStartsWithNoTarget, _007B2824_007D: false) >= 1f;

	public float BoardingHookReloadBonus => GetBonus(ShipBonusEffect.PBoardingHookReload, _007B2824_007D: false);

	public float BoardingWeightBonus => GetBonus(ShipBonusEffect.PMoreWeightAtBoarding, _007B2824_007D: false);

	public float LootInteropDistanceBonus => GetBonus(ShipBonusEffect.PLootInteropDistance, _007B2824_007D: false);

	public bool ProtectCrewWhenLooting => GetBonus(ShipBonusEffect.BCrewWillntDeadInSea, _007B2824_007D: false) > 0f;

	public float BoardingCrewProtectionCballs => GetBonus(ShipBonusEffect.PBoardingCrewProtectionCballs, _007B2824_007D: false);

	public float SailingCrewProtectionCballs => GetBonus(ShipBonusEffect.PSailorsCrewProtectionCballs, _007B2824_007D: false);

	public bool AllowPowderKegsAnySpeed => GetBonus(ShipBonusEffect.BAllowPowderKegAnySpeed, _007B2824_007D: false) >= 1f;

	public float GetSpecialUnitChanseBonusImperal => GetBonus(ShipBonusEffect.PSpecialUnitImperialUniqueChance, _007B2824_007D: false);

	public float GetSpecialUnitChanseBonusAtSea => GetBonus(ShipBonusEffect.PSpecialUnitChanseAtSea, _007B2824_007D: false);

	public float GetSpecialUnitChanseBonusGameModes => GetBonus(ShipBonusEffect.PSpecialUnitGameModeUniqueChance, _007B2824_007D: false);

	public float LootAtSeaBonus => GetBonus(ShipBonusEffect.PMoreLootAtSea, _007B2824_007D: false);

	public float LootRareItemsChanseBonus => GetBonus(ShipBonusEffect.PMoreRareItemsAtSea, _007B2824_007D: false);

	public float SickDeadFactor => 1f - GetBonus(ShipBonusEffect.PReduceSickDeadChanse, _007B2824_007D: false);

	public float SickGetChanse => 1f - GetBonus(ShipBonusEffect.PReduceSickGettingChanse, _007B2824_007D: false);

	public bool ExtraItemHasTimeout => GetBonus(ShipBonusEffect.BExtraItemHasNoTimeout, _007B2824_007D: false) <= 0.5f;

	public float MoreBondmanFromBoardingBonus => GetBonus(ShipBonusEffect.PMoreBondmanFromBoarding, _007B2824_007D: false);

	public float PowderKegIncreaseTriggerRadiusBonus => GetBonus(ShipBonusEffect.PPowderKegIncreaseTriggerRadius, _007B2824_007D: false);

	public float RestoreUnitsAfterBoarding => GetBonus(ShipBonusEffect.PRestoreUnitsAfterBoarding);

	public float RestoreStrengthWhenShipLooting => GetBonus(ShipBonusEffect.PRestoreHealthWhenGettingDebris);

	public float MortarDeadzoneDecrease => GetBonus(ShipBonusEffect.PMortarDecreaseDeadzone);

	public float PowerupItemReloadBonus => GetBonus(ShipBonusEffect.PPowerupItemsReload);

	public int ReduceBoardCannonsQuantity => (int)GetBonus(ShipBonusEffect.MPReduceCannonsQuantity, _007B2824_007D: false);

	public float BuckshotDamage => GetBonus(ShipBonusEffect.PBuckshotDamage);

	public bool DisableWindCourseChange => GetBonus(ShipBonusEffect.BDisableWindCourseChange, _007B2824_007D: false) >= 1f;

	public bool IsInvisibilityBonusEnabled => GetBonus(ShipBonusEffect.PInvisibility) != 0f;

	public float PaddleSpeedExtraBonus => GetBonus(ShipBonusEffect.PSpeedPaddles);

	public virtual float MendingKitEffectivityBonus => GetBonus(ShipBonusEffect.PPlayerMendingKitEffectivity);

	public virtual float EffectJerkBonusSpeed => GetBonus(ShipBonusEffect.MPlayerJerkEffectPowerAdd);

	public virtual float SpeedChangeBonus => GetBonus(ShipBonusEffect.PChangeShipSpeedBonus);

	public virtual bool MakeCrewInvisible => GetBonus(ShipBonusEffect.MMakeInvisiblePlaces) > 0f;

	public virtual float TiltReduce => GetBonus(ShipBonusEffect.PTiltReduce);

	public virtual float MarchingModeSpeedBonusSail => GetBonus(ShipBonusEffect.PMarchingSpeed);

	public virtual float MarchingModeSpeed => 7f * (1f + MarchingModeSpeedBonusSail) * (2f - Math.Max(1f, (Speed + 35f) / 50f));

	public virtual float SpeedLossInMarchingMode => 1f - GetBonus(ShipBonusEffect.PDecreaseSpeedLossMarchingMode, _007B2824_007D: false);

	public virtual int ExtraCrewLimit => 20 + (int)GetBonus(ShipBonusEffect.MMoreExtraCrew, _007B2824_007D: false);

	protected abstract float BasicHp { get; }

	protected abstract float BasicArmor { get; }

	protected abstract float BasicCapacity { get; }

	protected abstract float BasicMobility { get; }

	protected abstract int BasicCrewPlaces { get; }

	internal abstract float BasicSpeed { get; }

	public bool HavePowderItemsEffect => DynamicBonus != null && DynamicBonus.Stats[ShipBonusEffect.PBallDamage] + DynamicBonus.Stats[ShipBonusEffect.MWeaponPenetration] + DynamicBonus.Stats[ShipBonusEffect.MCannonsDistance] + DynamicBonus.Stats[ShipBonusEffect.PDamageToBuilds] > 0f;

	public float ServerMendingSailesPerSec => (DynamicBonus != null) ? DynamicBonus.Stats[ShipBonusEffect.ServMendingSailes] : 0f;

	public float ServerMendingStrengthPerSec => (DynamicBonus != null) ? DynamicBonus.Stats[ShipBonusEffect.ServMendingStrength] : 0f;

	public float ServerMendingTemporalStrengthPerSec => (DynamicBonus != null) ? DynamicBonus.Stats[ShipBonusEffect.ServMendingStrengthTemporal] : 0f;

	public void HitboxSailsStrengthCacheUpdate()
	{
		int num = HitboxSailsStrength.Length;
		if (num == 0)
		{
			_007B2828_007D = 1f;
			return;
		}
		_007B2828_007D = 0f;
		for (int i = 0; i < num; i++)
		{
			_007B2828_007D += HitboxSailsStrength[i] * StaticInfo.SailByStr(i).Weight;
		}
	}

	protected ShipDynamicInfo(ShipStaticInfo _007B2816_007D)
	{
		HitboxSailsStrength = new float[_007B2816_007D.SailHitboxes.Length];
		for (int i = 0; i < HitboxSailsStrength.Length; i++)
		{
			HitboxSailsStrength[i] = 1f;
		}
		StaticInfo = _007B2816_007D;
		firstHP = new ShipFirstHp(1f);
		HitboxSailsStrengthCacheUpdate();
		DynamicBonus = new DynamicEffectHelper();
	}

	public float DropLootingSpeedBonus(DropModel _007B2817_007D)
	{
		return (_007B2817_007D == DropModel.DebrisWithBox || _007B2817_007D == DropModel.PlayerThrowBox || _007B2817_007D == DropModel.RealShipLoot || _007B2817_007D == DropModel.ShipDebris || _007B2817_007D == DropModel.SmallBox || _007B2817_007D == DropModel.SmallDebris || _007B2817_007D == DropModel.RuinsFarming || _007B2817_007D == DropModel.SpecialBox || _007B2817_007D == DropModel.UnitOnRaft || _007B2817_007D == DropModel.RealShipLoot) ? GetBonus(ShipBonusEffect.PDropLootingSpeed) : 0f;
	}

	public float BoardingFailureDisatnce(Ship _007B2818_007D, Ship _007B2819_007D, bool _007B2820_007D)
	{
		return (StaticInfo.CorpusShape.FinalWidth + _007B2819_007D.UsedShip.StaticInfo.CorpusShape.FinalWidth) * 0.3f + (float)(_007B2820_007D ? 7 : ((_007B2818_007D.NowSpeed < 2f) ? 11 : 9)) * (1f + GetBonus(ShipBonusEffect.PBoardingDistance, _007B2824_007D: false));
	}

	public float DamageToSailFactorFromNodeID(int _007B2821_007D, bool _007B2822_007D)
	{
		float num = Math.Max(GetBonus(ShipBonusEffect.PSailProtection), GetBonus(ShipBonusEffect.PReduceDamage));
		return Math.Max(0f, Math.Min(_007B2822_007D ? 0.3f : 1f, 1f - num)) / StaticInfo.TrySailByNodeId(_007B2821_007D).Weight;
	}

	public CannonBallExtraEffects GetAllCannonBallEffects()
	{
		CannonBallExtraEffects cannonBallExtraEffects = CannonBallExtraEffects.None;
		if (GetBonus(ShipBonusEffect.BCannonBallFosforEffects) > 0f)
		{
			cannonBallExtraEffects |= CannonBallExtraEffects.PhosphorBoost;
		}
		else if (GetBonus(ShipBonusEffect.BCannonBallBobershell) > 0f)
		{
			cannonBallExtraEffects |= CannonBallExtraEffects.BombershellBoos;
		}
		if (GetBonus(ShipBonusEffect.BMoreFireAreaAndBurning) > 0f)
		{
			cannonBallExtraEffects |= CannonBallExtraEffects.MoreFireAreaAndBurning;
		}
		if (GetBonus(ShipBonusEffect.PBuckshotDamage) > 0f)
		{
			cannonBallExtraEffects |= CannonBallExtraEffects.BuckshotDamage;
		}
		return cannonBallExtraEffects;
	}

	protected abstract float GetBonus(ShipBonusEffect _007B2823_007D, bool _007B2824_007D = true);

	private static float Mix(float _007B2825_007D, float _007B2826_007D)
	{
		return _007B2825_007D * (1f - _007B2826_007D) + _007B2826_007D;
	}

	public (float distMin, float distMax, float cooldownMs, float preparationTime, float splash, float scatter, float angle) GetMortarsAverageParameters(CannonBallInfo _007B2827_007D)
	{
		float num = 0f;
		float num2 = 0f;
		float num3 = 0f;
		float num4 = 0f;
		float num5 = 0f;
		float num6 = 0f;
		float num7 = 0f;
		if (!(this is PlayerShipDynamicInfo playerShipDynamicInfo))
		{
			throw new NotSupportedException();
		}
		PlayerShipInfo craftFrom = playerShipDynamicInfo.CraftFrom;
		int num8 = 0;
		foreach (CannonGameInstance item in Mortars.Iterate())
		{
			(int, int) tuple = item.Info.DistanceMortar(craftFrom);
			num += (float)tuple.Item1;
			num2 += (float)tuple.Item2;
			num3 += (float)item.Info.ReloadTimeMortar(craftFrom);
			num4 += item.Info.MortarPreparationTimeMs(craftFrom);
			num5 += item.Info.SplashRadiusMortar;
			num6 += item.Info.Scatter;
			num7 += item.Info.MaxAxis;
			num8++;
		}
		if (num8 == 0)
		{
			return (distMin: 100f, distMax: 100f, cooldownMs: 1f, preparationTime: 1f, splash: 1f, scatter: 2f, angle: 0.14f);
		}
		return (distMin: num / (float)num8 * _007B2827_007D.DistanceFactor, distMax: num2 / (float)num8 * _007B2827_007D.DistanceFactor, cooldownMs: num3 / (float)num8, preparationTime: num4 / (float)num8, splash: num5 / (float)num8, scatter: num6 / (float)num8, angle: num7 / (float)num8);
	}
}
