using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Runtime.CompilerServices;
using System.Threading;
using Common.Account;
using Common.Game.Console;
using Common.Packets;
using Common.Resources;
using CommonDataTypes;
using Microsoft.Xna.Framework;
using TheraEngine;
using TheraEngine.Helpers;

namespace Common.Game;

public abstract class Player : Ship
{
	[CompilerGenerated]
	[DebuggerBrowsable(DebuggerBrowsableState.Never)]
	private Action<Ship, WorldMapInfo> _007B4939_007D;

	public bool IsMendingBegin;

	[CompilerGenerated]
	[DebuggerBrowsable(DebuggerBrowsableState.Never)]
	private CommandAccess _007B4940_007D = CommandAccess.User;

	public bool IsAnchored;

	public float ProtectionSafeZoneTimeout;

	private bool _007B4941_007D;

	private bool _007B4942_007D;

	private float _007B4943_007D;

	private TheraEngine.Timer _007B4944_007D;

	private TheraEngine.Timer _007B4945_007D;

	private float _007B4946_007D = 0f;

	private Vector2 _007B4947_007D;

	private float _007B4948_007D;

	protected bool safeZoneCanBeesetted;

	public float ReloadingWeaponsSpeed => (base.WeaponsAreShooting || IsInBoarding) ? 0f : (IsMendingBegin ? 0.15f : 1f);

	public float ReloadingFalkonetsSpeed => (base.WeaponsAreShootingWihtoutExtraTimers || IsInBoarding) ? 0f : (IsMendingBegin ? 0.15f : 1f);

	public abstract int MirrorEngageInPortBattlePortID { get; }

	public bool IsStaticForAllNpcs => MirrorEngageInPortBattlePortID != -1;

	public PlayerShipDynamicInfo UsedShipPlayer => (PlayerShipDynamicInfo)UsedShip;

	public bool IsPortEntry => _007B4941_007D;

	public bool DebugEnabled
	{
		get
		{
			return debugSpeedEnabled;
		}
		set
		{
			debugSpeedEnabled = value;
		}
	}

	public override bool IsStatic => base.IsStatic || AllowEnteringPort || _007B4941_007D;

	public float GetBattleTimer => _007B4943_007D;

	public int GetBattleTimerSec => Math.Max(1, (int)Math.Ceiling(_007B4943_007D / 1000f));

	public bool AllowEnteringPort => IsEntryToPortZoneContains && _007B4943_007D == 0f;

	public bool IsEntryToPortZoneContains => _007B4942_007D;

	public abstract PlayerAccount AccountConnection { get; }

	public CommandAccess CommandAccess
	{
		[CompilerGenerated]
		get
		{
			return _007B4940_007D;
		}
		[CompilerGenerated]
		set
		{
			_007B4940_007D = value;
		}
	}

	public sealed override float PalyerMarchingModeBonus => (UsedShip.StaticInfo.IsBalloon ? Geometry.Saturate((physicsBody.WindingDot - 0.95f) / 0.05f) : Geometry.Saturate((1f - 30f * Math.Abs(physicsBody.WindingDot - 0.9f)) * 3f * Math.Max(0f, physicsBody.WindingDotGradientDirection))) * PlayerMarchingModeBonusBySkill;

	public virtual float PlayerMarchingModeBonusBySkill => 2 + AccountConnection.CaptainSkills[PDynamicAccountBonus.CWindBonusSpeed];

	public override bool PlayerDisableDestructionTilt => AccountConnection.Rang <= 5;

	public float IsInShallowWater
	{
		get
		{
			//IL_0027: Unknown result type (might be due to invalid IL or missing references)
			//IL_002c: Unknown result type (might be due to invalid IL or missing references)
			if (!_007B4941_007D && MapInfo.IsWorldmap)
			{
				return MapInfo.Shallows.GetBilinearCmp(base.Position, UsedShipPlayer.CraftFrom.Rank);
			}
			return 0f;
		}
	}

	public bool IsProtectionSafeZoneTimeoutNotFrozen => _007B4948_007D == 0f || Vector2.DistanceSquared(_007B4947_007D, base.Position) > _007B4948_007D * _007B4948_007D;

	public override float ReduceDamageForServer
	{
		get
		{
			if (ProtectionSafeZoneTimeout == 0f)
			{
				return base.ReduceDamageForServer;
			}
			return Math.Max(base.ReduceDamageForServer, 0.9f);
		}
	}

	protected override ShipDynamicInfo AskActualShip
	{
		get
		{
			if (UsedShip == null)
			{
				if (AccountConnection.Shipyard.CurrentRealShip.firstHP.Summary > 0f)
				{
					return AccountConnection.Shipyard.CurrentRealShip;
				}
				return PlayerShipDynamicInfo.CreateNewFromShipInfo(Gameplay.PlayersInfo.FromID(1));
			}
			if (base.IsDestroyed)
			{
				if (AccountConnection.Shipyard.CurrentRealShip.firstHP.Summary > 0f)
				{
					return AccountConnection.Shipyard.CurrentRealShip;
				}
				if (UsedShip.StaticInfo.ID == 1)
				{
					return UsedShip;
				}
				return PlayerShipDynamicInfo.CreateNewFromShipInfo(Gameplay.PlayersInfo.FromID(1));
			}
			return AccountConnection.Shipyard.CurrentRealShip;
		}
	}

	public PortEnteringType NearPortType
	{
		get
		{
			//IL_0023: Unknown result type (might be due to invalid IL or missing references)
			//IL_0028: Unknown result type (might be due to invalid IL or missing references)
			//IL_004a: Unknown result type (might be due to invalid IL or missing references)
			//IL_0050: Unknown result type (might be due to invalid IL or missing references)
			if (!MapInfo.IsWorldmap)
			{
				return PortEnteringType.Port;
			}
			if (AccountConnection.PersonalIsles.GetContained(base.Position, _007B1961_007D: true) != null)
			{
				return PortEnteringType.PersonalIsle;
			}
			IslePortInfo nearPort = base.NearPort;
			if (Vector2.Distance(nearPort.Entry.Position, base.Position) < nearPort.GlobalEntryRadius + 15f)
			{
				return PortEnteringType.Port;
			}
			return PortEnteringType.Miniport;
		}
	}

	public GSI ResourcesOfHold
	{
		get
		{
			if (UsedShip.StaticInfo.ID == 1 && !UsedShipPlayer.IsRemoteOrSlim)
			{
				return AccountConnection.Shipyard.CurrentRealShip.PrivateResourcesOfHold;
			}
			return UsedShipPlayer.PrivateResourcesOfHold;
		}
	}

	public bool SpeedAllowMending => FirstController.LinearStateCode <= 1 || FirstController.LinearStateCode == 4 || (UsedShip.CanRepairWithSpeed2 && FirstController.LinearStateCode == 2);

	public abstract bool EnableUpgradeWear { get; }

	protected internal virtual bool Get_ShowSailesInPort => true;

	public event Action<Ship, WorldMapInfo> EvMapTeleport
	{
		[CompilerGenerated]
		add
		{
			Action<Ship, WorldMapInfo> action = _007B4939_007D;
			Action<Ship, WorldMapInfo> action2;
			do
			{
				action2 = action;
				Action<Ship, WorldMapInfo> value2 = (Action<Ship, WorldMapInfo>)Delegate.Combine(action2, value);
				action = Interlocked.CompareExchange(ref _007B4939_007D, value2, action2);
			}
			while ((object)action != action2);
		}
		[CompilerGenerated]
		remove
		{
			Action<Ship, WorldMapInfo> action = _007B4939_007D;
			Action<Ship, WorldMapInfo> action2;
			do
			{
				action2 = action;
				Action<Ship, WorldMapInfo> value2 = (Action<Ship, WorldMapInfo>)Delegate.Remove(action2, value);
				action = Interlocked.CompareExchange(ref _007B4939_007D, value2, action2);
			}
			while ((object)action != action2);
		}
	}

	public Player()
	{
		_007B4944_007D = new TheraEngine.Timer(900f);
		_007B4945_007D = new TheraEngine.Timer(1000f);
	}

	public override void ClearResources()
	{
		FirstController.Change = null;
		_007B4941_007D = false;
		_007B4943_007D = 0f;
		IsMendingBegin = false;
		_007B4944_007D.Ceiling();
		_007B4945_007D.Ceiling();
		_007B4939_007D = null;
		_007B4942_007D = false;
		ProtectionSafeZoneTimeout = 0f;
		IsAnchored = false;
		_007B4946_007D = 0f;
		_007B4948_007D = 0f;
		base.ClearResources();
	}

	protected void InternalInitialize(ShipPositionInfo _007B4909_007D, int _007B4910_007D, WorldMapInfo _007B4911_007D)
	{
		Initialize(_007B4910_007D, _007B4909_007D, _007B4911_007D);
		if (UsedShip.GetType() != typeof(RemotePlayerDynamicInfo))
		{
			UpdateCapacity();
		}
		ShipKeyController firstController = FirstController;
		firstController.Change = (Action)Delegate.Combine(firstController.Change, new Action(base.UpdateSailClotting));
		UsedShip.Cannons.BeginReloadWeapons(this, null, null, null);
		if (_007B4911_007D.IsEducationMap)
		{
			RestoreHp(1000f);
		}
		_007B4913_007D(0f);
		if (!_007B4941_007D)
		{
			_007B4938_007D();
		}
		if (AccountConnection != null)
		{
			UsedShipPlayer.AllStatFine = AccountConnection.Shipyard.GetStatFine(UsedShipPlayer.CraftFrom);
		}
	}

	protected new void Update(ref FrameTime _007B4912_007D)
	{
		//IL_02e6: Unknown result type (might be due to invalid IL or missing references)
		//IL_02eb: Unknown result type (might be due to invalid IL or missing references)
		CheckShip(_007B4980_007D: false);
		if (!UsedShipPlayer.IsRemoteOrSlim)
		{
			if (IsPortEntry)
			{
				UsedShipPlayer.AllStatFine = AccountConnection.Shipyard.GetStatFine(UsedShipPlayer.CraftFrom);
			}
			UsedShipPlayer.internalFoodBonus = AccountConnection.FoodAtShip.BonusAmount(UsedShip);
		}
		_007B4912_007D.EvaluteTimerMs(ref _007B4943_007D);
		if (IsProtectionSafeZoneTimeoutNotFrozen)
		{
			_007B4948_007D = 0f;
			_007B4912_007D.EvaluteTimerSec(ref ProtectionSafeZoneTimeout);
		}
		base.Update(ref _007B4912_007D);
		if (IsMendingBegin)
		{
			if (_007B4944_007D.Sample(ref _007B4912_007D))
			{
				MendingLoop();
			}
		}
		else
		{
			_007B4944_007D.Ceiling();
		}
		if (UsedShip.StaticInfo.HasSteamWheel)
		{
			if (_007B4945_007D.Sample(ref _007B4912_007D))
			{
				WheelCoalUsingLoop();
			}
		}
		else
		{
			_007B4945_007D.Ceiling();
		}
		if (!UsedShipPlayer.IsRemoteOrSlim)
		{
			UsedShip.Cannons.UpdateReloading(_007B4912_007D * ReloadingWeaponsSpeed, this, UsedShip.CannonsReloadSpeedBonus);
		}
		_007B4913_007D(_007B4912_007D.secElapsed);
		if (base.IsDestroyed || !MapInfo.IsWorldmap || UsedShip.StaticInfo.IsBalloon || IsEntryToPortZoneContains)
		{
			return;
		}
		_007B4946_007D += ((Vector2)(ref physicsBody.VelocityPerSec)).Length() * _007B4912_007D.secElapsed;
		if (!(_007B4946_007D > 5f))
		{
			return;
		}
		if (!UsedShipPlayer.IsRemoteOrSlim)
		{
			UsedShipPlayer.Upgrades.EvaluteStrength(UsedShipPlayer, UpgradeStrengthWear.SailingDistance, _007B4946_007D, this);
		}
		if (AccountConnection != null)
		{
			AccountConnection.SailingDistanceAtSea += (int)_007B4946_007D;
			foreach (QuestRunningProgress item in (IEnumerable<QuestRunningProgress>)AccountConnection.Quests.ProgressRunningQuests)
			{
				if (item.CurrentStep is QuestPassDistance questPassDistance && (!questPassDistance.DisallowAnyPvpProtection || !AccountConnection.WorldFlag.IsPeaceMode()))
				{
					item.ProgressInStep = Math.Min(item.ProgressInStep + (int)_007B4946_007D, questPassDistance.RequiredDistance);
				}
			}
			AccountConnection.FogOfWar.WhenPlayerMoving(base.Position);
		}
		_007B4946_007D -= (int)_007B4946_007D;
	}

	private void _007B4913_007D(float _007B4914_007D)
	{
		//IL_002e: Unknown result type (might be due to invalid IL or missing references)
		//IL_0033: Unknown result type (might be due to invalid IL or missing references)
		//IL_003e: Unknown result type (might be due to invalid IL or missing references)
		//IL_0044: Unknown result type (might be due to invalid IL or missing references)
		if (MapInfo.Ports.Size == 0)
		{
			_007B4942_007D = false;
			return;
		}
		IslePortInfo nearPort = MapInfo.GetNearPort(base.Position);
		_007B4942_007D = VectorExternsionsDistanceTest.DTest2(nearPort.EntryPos, base.Position, _007B4942_007D ? nearPort.GlobalEntryRadius : (nearPort.GlobalEntryRadius - 1f));
		if (!_007B4941_007D && MirrorEngageInPortBattlePortID == nearPort.PortID && !_007B4942_007D)
		{
			BeginBattleTimer(_007B4918_007D: false, _007B4919_007D: true);
		}
	}

	public void OnExitWithProtection(Vector2 _007B4915_007D, float _007B4916_007D, bool _007B4917_007D)
	{
		//IL_0002: Unknown result type (might be due to invalid IL or missing references)
		//IL_0003: Unknown result type (might be due to invalid IL or missing references)
		_007B4947_007D = _007B4915_007D;
		_007B4948_007D = _007B4916_007D;
		safeZoneCanBeesetted = _007B4917_007D;
		ProtectionSafeZoneTimeout = 25f;
	}

	public void OnSetProtectionAfterBoarding()
	{
		ProtectionSafeZoneTimeout = Math.Max(ProtectionSafeZoneTimeout, 5f);
		safeZoneCanBeesetted = false;
	}

	public void BeginBattleTimer(bool _007B4918_007D, bool _007B4919_007D)
	{
		_007B4943_007D = Math.Max(_007B4943_007D, _007B4919_007D ? 40000f : (_007B4918_007D ? 40000f : 25000f));
	}

	internal void ResetBattleTimer()
	{
		_007B4943_007D = 0f;
	}

	public void SetBattleTimer(float _007B4920_007D)
	{
		_007B4943_007D = _007B4920_007D;
	}

	public void EducationLeave()
	{
		//IL_0068: Unknown result type (might be due to invalid IL or missing references)
		if (MapInfo.ID != 0)
		{
			throw new InvalidOperationException();
		}
		AccountConnection.Shipyard.Select(0);
		CheckShip(_007B4980_007D: true);
		AccountConnection.Shipyard.RemoveEducShip(2);
		ShipPositionInfo entry = Gameplay.WorldMap.Ports.Array[AccountConnection.StartPortId].Entry;
		base.Position = entry.Position;
		base.Rotation = entry.Rotation;
		TeleportMapChange(Gameplay.WorldMap);
	}

	public void ApplyWorldTravel(Vector2 _007B4921_007D, bool _007B4922_007D)
	{
		//IL_002f: Unknown result type (might be due to invalid IL or missing references)
		AccountConnection.NearPortStorage.Add(UsedShipPlayer.PrivateResourcesOfHold);
		UsedShipPlayer.PrivateResourcesOfHold.Clean();
		base.Position = _007B4921_007D;
		if (_007B4922_007D)
		{
			AccountConnection.BlockWorldBigTravelTimeSec = (float)(3600 * ((AccountConnection.CaptainSkills[PDynamicAccountBonus.CPersonalIsleLimit] >= 2) ? 2 : 4)) * (1f - (float)AccountConnection.CaptainSkills[PDynamicAccountBonus.PTravelCooldownBonus] / 100f);
			return;
		}
		if (AccountConnection.UsedWorldTravelCount == 0)
		{
			AccountConnection.BlockWorldTravelTimeSec = 7200f;
		}
		AccountConnection.UsedWorldTravelCount++;
	}

	public void TeleportMapChange(WorldMapInfo _007B4923_007D)
	{
		UsedShip.firstHP.OnPortEntry();
		UsedShip.Cannons.RestoreAllBroken(UsedShip.StaticInfo);
		WorldMapInfo mapInfo = MapInfo;
		MapInfo = _007B4923_007D;
		_007B4939_007D?.Invoke(this, mapInfo);
		Stopful();
	}

	public override void MakeDamage(in DamageData _007B4924_007D, int _007B4925_007D)
	{
		if (_007B4941_007D)
		{
			return;
		}
		if (_007B4924_007D.SourcePawnType != DamageID.Collision || _007B4925_007D != -1)
		{
			BeginBattleTimer(_007B4924_007D.Flags.HasFlag(SpecificDamageFlags.PvPDamage), _007B4919_007D: false);
		}
		if (!MapInfo.IsEducationMap || !(UsedShip.firstHP.Summary - _007B4924_007D.HealthDamage < 73f))
		{
			if (UsedShip.firstHP.Summary > 5f)
			{
				UsedShipPlayer.Upgrades.EvaluteStrength(UsedShipPlayer, UpgradeStrengthWear.ReceivedDamage, _007B4924_007D.HealthDamage, this);
			}
			base.MakeDamage(in _007B4924_007D, _007B4925_007D);
		}
	}

	public void OnCannonsShot(int _007B4926_007D)
	{
		if (!UsedShipPlayer.IsRemoteOrSlim)
		{
			UsedShipPlayer.Upgrades.EvaluteStrength(UsedShipPlayer, UpgradeStrengthWear.ShotsCount, (float)_007B4926_007D / (float)Math.Max(UsedShip.StaticInfo.LeftSidePorts.Length, UsedShip.StaticInfo.FrontSidePorts.Length), this);
		}
		BeginBattleTimer(_007B4918_007D: false, _007B4919_007D: false);
		if (safeZoneCanBeesetted)
		{
			ProtectionSafeZoneTimeout = 0f;
		}
	}

	public void OnMortarShot(bool _007B4927_007D)
	{
		if (!UsedShipPlayer.IsRemoteOrSlim)
		{
			UsedShipPlayer.Upgrades.EvaluteStrength(UsedShipPlayer, UpgradeStrengthWear.MortarShotsCount, 1f, this);
			CannonLocationInfo[] mortarPorts = UsedShip.StaticInfo.MortarPorts;
			foreach (CannonLocationInfo cannonLocationInfo in mortarPorts)
			{
				if (_007B4927_007D == (cannonLocationInfo.Side == CannonLocation.InFront))
				{
					CannonGameInstance cannonGameInstance = UsedShip.Mortars[cannonLocationInfo.SectionID];
					if (cannonGameInstance != null)
					{
						cannonGameInstance.RemainReserve = (ushort)Math.Max(0, cannonGameInstance.RemainReserve - 1);
					}
				}
			}
		}
		BeginBattleTimer(_007B4918_007D: false, _007B4919_007D: false);
		if (safeZoneCanBeesetted)
		{
			ProtectionSafeZoneTimeout = 0f;
		}
	}

	public void OnFalkonetOrKegShot()
	{
		BeginBattleTimer(_007B4918_007D: false, _007B4919_007D: false);
		if (safeZoneCanBeesetted)
		{
			ProtectionSafeZoneTimeout = 0f;
		}
	}

	public void Respawn(ShipPositionInfo _007B4928_007D, RespawnHealthAmount _007B4929_007D)
	{
		//IL_009f: Unknown result type (might be due to invalid IL or missing references)
		PlayerShipDynamicInfo currentRealShip = AccountConnection.Shipyard.CurrentRealShip;
		currentRealShip.firstHP.ResetEffects();
		currentRealShip.firstHP.Restore(1f, 1f);
		currentRealShip.firstHP.DestroyedByFloodingFlags = false;
		currentRealShip.Crew.HurtedCrew.Clean();
		CheckShip(_007B4980_007D: true);
		float num = 0.33f;
		switch (_007B4929_007D)
		{
		case RespawnHealthAmount.Full:
			num = 1f;
			break;
		case RespawnHealthAmount.About75Percent:
			num = 0.7f;
			break;
		}
		RestoreHp(UsedShip.MaxHp * num);
		RestoreSailes(1f);
		base.Position = _007B4928_007D.Position;
		base.Rotation = _007B4928_007D.Rotation;
		OnRespawn();
		Stopful();
	}

	public virtual void EntryToPort()
	{
		if (AccountConnection != null)
		{
			AccountConnection.PowerupItemExtraSlot = byte.MaxValue;
			AccountConnection.UpdateNearPortStorage(this);
			if (AccountConnection.SailingDistanceAtSea > 0f)
			{
				bool _007B3740_007D;
				int num = Gameplay.SailingXp(AccountConnection, AccountConnection.SailingDistanceAtSea, ResourcesOfHold, out _007B3740_007D);
				if (num > 0)
				{
					WhenSailingXpAdded(num, _007B3740_007D);
				}
				AccountConnection.SailingDistanceAtSea = 0f;
				AccountConnection.AddXp(num);
			}
			AccountConnection.ResetActivatedPowerupItems();
			if (MapInfo.IsWorldmap && NearPortType == PortEnteringType.Port)
			{
				AccountConnection.FogOfWar.WhenPlayerEnterPort(base.NearPort);
			}
			UsedShipPlayer.AllStatFine = AccountConnection.Shipyard.GetStatFine(UsedShipPlayer.CraftFrom);
		}
		IsMendingBegin = false;
		UsedShipPlayer.DynamicBonus.RemoveEffects(_007B2673_007D: true);
		UsedShip.firstHP.OnPortEntry();
		UsedShip.Cannons.RestoreAllBroken(UsedShip.StaticInfo);
		UsedShip.Crew.HurtedCrew.Clean();
		UsedShipPlayer.Upgrades.UpdateInformation(UsedShipPlayer.CraftFrom);
		_007B4941_007D = true;
		UpdateSailClotting();
		IsAnchored = false;
		_007B4943_007D = 0f;
		_007B4913_007D(0f);
		Stopful();
	}

	public virtual void ExitOfPort()
	{
		_007B4941_007D = false;
		UpdateSailClotting();
		UsedShip.Cannons.OnExitFromPort();
		UpdateCapacity();
		UsedShipPlayer.AllStatFine = AccountConnection.Shipyard.GetStatFine(UsedShipPlayer.CraftFrom);
		_007B4938_007D();
	}

	public virtual void FinishingGamemode(ShipPositionInfo _007B4930_007D)
	{
		//IL_005e: Unknown result type (might be due to invalid IL or missing references)
		FalkonetShooting.Reset();
		AccountConnection.Shipyard.CurrentRealShip.DynamicBonus.RemoveAllArenaUpgrdaes();
		AccountConnection.Shipyard.CurrentRealShip.PrivateResourcesOfHold[19] = 0;
		if (base.IsDestroyed)
		{
			Respawn(_007B4930_007D, RespawnHealthAmount.Full);
		}
		else
		{
			base.Position = _007B4930_007D.Position;
			base.Rotation = _007B4930_007D.Rotation;
		}
		_007B4943_007D = 0f;
		UsedShip.FirstHP.Check(UsedShip.MaxHp);
	}

	private static float trilerp_half(float _007B4931_007D, float _007B4932_007D, float _007B4933_007D, float _007B4934_007D)
	{
		if (_007B4934_007D < 0.5f)
		{
			return MathHelper.Lerp(_007B4931_007D, _007B4932_007D, _007B4934_007D * 2f);
		}
		return MathHelper.Lerp(_007B4932_007D, _007B4933_007D, (_007B4934_007D - 0.5f) * 2f);
	}

	public void SetCapacityFactorRemote(float _007B4935_007D)
	{
		basicCapacitySpeedFactor = _007B4935_007D;
	}

	public virtual bool UpdateCapacity()
	{
		if (AccountConnection != null)
		{
			WosbTreasuryMaps.DetachMaps(AccountConnection);
		}
		float num = 0.7f / UsedShip.SpeedWithoutTempEffects;
		float num2 = 0.7f / UsedShip.SpeedWithoutTempEffects;
		float num3 = UsedShipPlayer.GetItemsMass() / UsedShip.Capacity;
		float num4 = ((num3 < 0.5f) ? (1f + (1f - num3 / 0.5f) * num) : ((!(num3 < 1f)) ? MathHelper.Lerp((1f - num2) / (num3 * num3 * num3), 1f - num2, UsedShip.OverweightFineReduce) : (1f - num2 * (num3 - 0.5f) / 0.5f)));
		bool result = basicCapacitySpeedFactor != num4;
		basicCapacitySpeedFactor = num4;
		if (num3 >= 2.5f)
		{
			basicCapacitySpeedFactor = 0f;
		}
		return result;
	}

	protected virtual void WhenSailingXpAdded(int _007B4936_007D, bool _007B4937_007D)
	{
	}

	private void _007B4938_007D()
	{
		if (AccountConnection == null)
		{
			return;
		}
		foreach (QuestRunningProgress item in (IEnumerable<QuestRunningProgress>)AccountConnection.Quests.ProgressRunningQuests)
		{
			for (int i = 0; i < item.Info.ShipEffects.Length; i++)
			{
				UsedShipPlayer.DynamicBonus.AddArenaUpgrade(item.Info.ShipEffects[i]);
				if (item.Info.ShipEffects[i].Type == ShipBonusEffect.PHealth || item.Info.ShipEffects[i].Type == ShipBonusEffect.MHealth)
				{
					RestoreHp(UsedShip.MaxHp);
				}
			}
		}
	}

	protected override void DestroyCallback()
	{
		//IL_00d3: Unknown result type (might be due to invalid IL or missing references)
		//IL_00d9: Unknown result type (might be due to invalid IL or missing references)
		//IL_00e4: Unknown result type (might be due to invalid IL or missing references)
		//IL_00ee: Unknown result type (might be due to invalid IL or missing references)
		//IL_0103: Unknown result type (might be due to invalid IL or missing references)
		//IL_0108: Unknown result type (might be due to invalid IL or missing references)
		if (MapInfo.IsWorldmap && AccountConnection != null)
		{
			if (MirrorEngageInPortBattlePortID == -1 && UsedShipPlayer.CraftFrom.MaxIntegrity != -1)
			{
				UsedShipPlayer.Integrity = Math.Max(0, UsedShipPlayer.Integrity - 1);
			}
			AccountConnection.RespawnOnBoatTimeouSec = (base.IsOutsideSeam ? 60f : 240f);
		}
		IsMendingBegin = false;
		UsedShipPlayer.DynamicBonus.RemoveEffects(_007B2673_007D: false);
		Stopful();
		UsedShip.Cannons.OnExitFromPort();
		UsedShip.Cannons.RestoreAllBroken(UsedShip.StaticInfo);
		base.Position += new Vector2(base.FastNormal.Y, base.FastNormal.X) * UsedShip.StaticInfo.CorpusHalfWidth;
		base.DestroyCallback();
	}

	protected virtual void MendingLoop()
	{
		UsedShip.firstHP.BurningMendingLoop(this);
	}

	protected virtual void WheelCoalUsingLoop()
	{
	}

	protected override void OnRespawn()
	{
		base.OnRespawn();
		_007B4913_007D(0f);
	}
}
