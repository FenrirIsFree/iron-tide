using System;
using System.Diagnostics;
using System.Runtime.CompilerServices;
using System.Threading;
using Common.Packets;
using Common.Resources;
using Microsoft.Xna.Framework;
using TheraEngine;
using TheraEngine.Collections;
using TheraEngine.Components;
using TheraEngine.Helpers;
using TheraEngine.Reactive;
using UWPhysicsWOSLib;
using UWPhysicsWOSLib.Collision;
using UWPhysicsWOSLib.Shapes;

namespace Common.Game;

public abstract class Ship : UIDSceneObject, IPoolObject
{
	public readonly ReactiveSafeEvent<ShipCleanupEventArgs> ManualLostEvent = new ReactiveSafeEvent<ShipCleanupEventArgs>();

	[CompilerGenerated]
	[DebuggerBrowsable(DebuggerBrowsableState.Never)]
	private Action<float> _007B5022_007D;

	[CompilerGenerated]
	[DebuggerBrowsable(DebuggerBrowsableState.Never)]
	private readonly float _007B5023_007D;

	[CompilerGenerated]
	[DebuggerBrowsable(DebuggerBrowsableState.Never)]
	private readonly bool _007B5024_007D;

	public CommonShotRenderer<SingleShotData> ServerWeaponsShooting;

	public CommonShotRenderer<CommonShotInfo> ClientWeaponsShooting;

	public readonly DeferredShooting<FalkonetShotInfoRemote> FalkonetShooting;

	public readonly ShipKeyController FirstController;

	public WorldMapInfo MapInfo;

	public bool[] OpenSailesFromIndices;

	public ShipDynamicInfo UsedShip;

	public readonly PositionCorrector Corrector;

	public readonly PositionCorrector PhysicCorrector;

	public float PrevDisplayMaxSpeed;

	public float PrevDisplayMaxSpeedIncMarchMode;

	public readonly ShipPhysics physicsBody;

	public bool InstanceAlive = false;

	public bool KilledByFireworks;

	private float[] _007B5025_007D;

	internal Matrix? LastWorld;

	protected bool debugSpeedEnabled;

	protected internal int burningSourceUID;

	protected internal float basicCapacitySpeedFactor;

	internal readonly Transform3D transform;

	private readonly TheraEngine.Timer _007B5026_007D;

	protected float marchModeBonusSpeed;

	private float _007B5027_007D;

	public static bool SailesSpeed2Test;

	public abstract bool DetailPhysics { get; }

	public virtual bool IsStatic => IsDestroyed;

	public ShipPositionInfo GetShipPositionInfo => new ShipPositionInfo(transform.Translation, transform.Yaw);

	public bool IsDestroyed
	{
		[MethodImpl(MethodImplOptions.AggressiveInlining)]
		get
		{
			return UsedShip.firstHP.Summary == 0f || (UsedShip.StaticInfo.ID == 1 && this is Player);
		}
	}

	public bool IsDestroyedOrFlooding => UsedShip != null && (IsDestroyed || UsedShip.firstHP.currentTimeFlooding > 0f);

	public bool IsHaveDestructionTilt => MapInfo.Weather.RainingLevel(Position) > 0.5f && !IsDestroyedOrFlooding && !MapInfo.IsEducationMap && !PlayerDisableDestructionTilt && Math.Abs(Transform.Pitch) - 0.25f > 0f;

	public float HaveLowhpMarchingSpeedDebuf => Geometry.Saturate((0.25f - UsedShip.hpFactorCached) / 0.15f) * 0.33f;

	public float DestructByTiltAmount => _007B5027_007D;

	public Vector3 Position3D => transform.Translation;

	public Vector2 ApproximatePositionOfFloodingHalf => Position + FastNormal * (NowSpeed * 0.35f);

	public Vector2 ApproximatePositionOfFlooding => Position + FastNormal * (NowSpeed * 0.5f);

	public virtual float ReduceDamageForServer => UsedShip.DamageReduce;

	public Vector2 Normal
	{
		get
		{
			//IL_002f: Unknown result type (might be due to invalid IL or missing references)
			//IL_0030: Unknown result type (might be due to invalid IL or missing references)
			//IL_0033: Unknown result type (might be due to invalid IL or missing references)
			Vector2 result = default(Vector2);
			result.X = MathF.Cos(transform.Yaw);
			result.Y = MathF.Sin(transform.Yaw);
			return result;
		}
	}

	public Vector2 FastNormal => Geometry.FastSinCos(transform.Yaw);

	public ShipPositionInfo CreateServerTransform
	{
		get
		{
			//IL_001f: Unknown result type (might be due to invalid IL or missing references)
			//IL_002a: Unknown result type (might be due to invalid IL or missing references)
			//IL_002f: Unknown result type (might be due to invalid IL or missing references)
			//IL_0034: Unknown result type (might be due to invalid IL or missing references)
			//IL_0064: Unknown result type (might be due to invalid IL or missing references)
			//IL_006f: Unknown result type (might be due to invalid IL or missing references)
			//IL_0074: Unknown result type (might be due to invalid IL or missing references)
			//IL_0079: Unknown result type (might be due to invalid IL or missing references)
			if (CommonGlobal.IsServer)
			{
				throw new InvalidOperationException();
			}
			ShipPositionInfo getShipPositionInfo = GetShipPositionInfo;
			ref Vector2 position = ref getShipPositionInfo.Position;
			position += Corrector.RemainingPositionOffset;
			getShipPositionInfo.Rotation += Corrector.RemainingRotationOffset;
			Geometry.AxisNorm(ref getShipPositionInfo.Rotation);
			ref Vector2 position2 = ref getShipPositionInfo.Position;
			position2 += PhysicCorrector.RemainingPositionOffset;
			getShipPositionInfo.Rotation += PhysicCorrector.RemainingRotationOffset;
			Geometry.AxisNorm(ref getShipPositionInfo.Rotation);
			return getShipPositionInfo;
		}
	}

	public ShipPositionInfo CreateServerTransformPhisycsOnly
	{
		get
		{
			//IL_001f: Unknown result type (might be due to invalid IL or missing references)
			//IL_002a: Unknown result type (might be due to invalid IL or missing references)
			//IL_002f: Unknown result type (might be due to invalid IL or missing references)
			//IL_0034: Unknown result type (might be due to invalid IL or missing references)
			if (CommonGlobal.IsServer)
			{
				throw new InvalidOperationException();
			}
			ShipPositionInfo getShipPositionInfo = GetShipPositionInfo;
			ref Vector2 position = ref getShipPositionInfo.Position;
			position += PhysicCorrector.RemainingPositionOffset;
			getShipPositionInfo.Rotation += PhysicCorrector.RemainingRotationOffset;
			Geometry.AxisNorm(ref getShipPositionInfo.Rotation);
			return getShipPositionInfo;
		}
	}

	public Transform3D Transform => transform;

	public float NowSpeed => physicsBody.NowSpeed;

	public Vector3 PowderKegStartPosition
	{
		get
		{
			//IL_0002: Unknown result type (might be due to invalid IL or missing references)
			//IL_0008: Unknown result type (might be due to invalid IL or missing references)
			//IL_001d: Unknown result type (might be due to invalid IL or missing references)
			//IL_0022: Unknown result type (might be due to invalid IL or missing references)
			//IL_0027: Unknown result type (might be due to invalid IL or missing references)
			//IL_0028: Unknown result type (might be due to invalid IL or missing references)
			//IL_002f: Unknown result type (might be due to invalid IL or missing references)
			//IL_003f: Unknown result type (might be due to invalid IL or missing references)
			//IL_0045: Unknown result type (might be due to invalid IL or missing references)
			//IL_004a: Unknown result type (might be due to invalid IL or missing references)
			//IL_004d: Unknown result type (might be due to invalid IL or missing references)
			Vector2 val = Position - FastNormal * UsedShip.StaticInfo.CorpusHalfLength;
			return new Vector3(val.X, Position3D.Y + 2f, val.Y);
		}
	}

	internal float SailSpeedFactor => Math.Min(1f, UsedShip.FirstSailHP / 0.99f);

	public IslePortInfo NearPort => (MapInfo.IsWorldmap || MapInfo.IsEducationMap) ? MapInfo.GetNearPort(Position) : null;

	public IslePortInfo? NearAquatoria
	{
		get
		{
			//IL_000b: Unknown result type (might be due to invalid IL or missing references)
			//IL_0011: Unknown result type (might be due to invalid IL or missing references)
			IslePortInfo nearPort = NearPort;
			return (nearPort != null && Vector2.DistanceSquared(nearPort.EntryPos, Position) < Gameplay.PortAquatoriaSize * Gameplay.PortAquatoriaSize) ? nearPort : null;
		}
	}

	public TraderInSeaPlaceInfo NearTraderInSea => (MapInfo.IsWorldmap || MapInfo.IsEducationMap) ? MapInfo.GetNearTraderInSea(Position) : null;

	public float MaxExtraMarchSpeed => UsedShip.MarchingModeSpeed + PalyerMarchingModeBonus;

	public virtual float PalyerMarchingModeBonus
	{
		[CompilerGenerated]
		get
		{
			return _007B5023_007D;
		}
	}

	public virtual bool PlayerDisableDestructionTilt
	{
		[CompilerGenerated]
		get
		{
			return _007B5024_007D;
		}
	}

	public bool IsRunningMarchingMode => marchModeBonusSpeed > 0.1f;

	public Vector2 PositionClampedToMap
	{
		get
		{
			//IL_004d: Unknown result type (might be due to invalid IL or missing references)
			//IL_004e: Unknown result type (might be due to invalid IL or missing references)
			//IL_0051: Unknown result type (might be due to invalid IL or missing references)
			Vector2 _007B3047_007D = default(Vector2);
			_007B3047_007D.X = transform.Translation.X;
			_007B3047_007D.Y = transform.Translation.Z;
			if (MapInfo.IsWorldmap)
			{
				MapInfo.ClampToMap(ref _007B3047_007D);
			}
			return _007B3047_007D;
		}
	}

	public bool IsOutsideSeam => !MapInfo.IsInsideMap(transform.Translation.XZ());

	public bool WeaponsAreShooting => CommonGlobal.IsServer ? ServerWeaponsShooting.ShotIsProcessing : ClientWeaponsShooting.ShotIsProcessing;

	public bool WeaponsAreShootingWihtoutExtraTimers => CommonGlobal.IsServer ? ServerWeaponsShooting.ShotIsProcessingWithoutWait : ClientWeaponsShooting.ShotIsProcessingWithoutWait;

	public bool IsShottingVisible => CommonGlobal.IsServer ? (ServerWeaponsShooting.VisibilityTimerSec > 0f) : (ClientWeaponsShooting.VisibilityTimerSec > 0f);

	public abstract bool IsInBoarding { get; }

	public float Rotation
	{
		get
		{
			return transform.Yaw;
		}
		set
		{
			transform.Yaw = value;
		}
	}

	public Vector2 Position
	{
		get
		{
			//IL_002f: Unknown result type (might be due to invalid IL or missing references)
			//IL_0030: Unknown result type (might be due to invalid IL or missing references)
			//IL_0033: Unknown result type (might be due to invalid IL or missing references)
			Vector2 result = default(Vector2);
			result.X = transform.Translation.X;
			result.Y = transform.Translation.Z;
			return result;
		}
		set
		{
			//IL_000c: Unknown result type (might be due to invalid IL or missing references)
			//IL_0022: Unknown result type (might be due to invalid IL or missing references)
			transform.Translation.X = value.X;
			transform.Translation.Z = value.Y;
		}
	}

	public float CapacitySpeedFactor
	{
		get
		{
			if (UsedShip.StaticInfo.ID == 1)
			{
				return 1f;
			}
			float speedWithoutTempEffects = UsedShip.SpeedWithoutTempEffects;
			float num = UsedShip.Speed - speedWithoutTempEffects;
			float num2 = basicCapacitySpeedFactor;
			return speedWithoutTempEffects * (num2 - 1f) / (speedWithoutTempEffects + num) + 1f;
		}
	}

	public PlayerShipInfo CraftFrom
	{
		get
		{
			PlayerShipInfo result;
			if (!(UsedShip is PlayerShipDynamicInfo playerShipDynamicInfo))
			{
				if (!(UsedShip is NpcShipDynamicInfo npcShipDynamicInfo))
				{
					throw new NotSupportedException();
				}
				result = npcShipDynamicInfo.Information.BasedOn;
			}
			else
			{
				result = playerShipDynamicInfo.CraftFrom;
			}
			return result;
		}
	}

	protected abstract ShipDynamicInfo AskActualShip { get; }

	public event Action<float> EvHpResotred
	{
		[CompilerGenerated]
		add
		{
			Action<float> action = _007B5022_007D;
			Action<float> action2;
			do
			{
				action2 = action;
				Action<float> value2 = (Action<float>)Delegate.Combine(action2, value);
				action = Interlocked.CompareExchange(ref _007B5022_007D, value2, action2);
			}
			while ((object)action != action2);
		}
		[CompilerGenerated]
		remove
		{
			Action<float> action = _007B5022_007D;
			Action<float> action2;
			do
			{
				action2 = action;
				Action<float> value2 = (Action<float>)Delegate.Remove(action2, value);
				action = Interlocked.CompareExchange(ref _007B5022_007D, value2, action2);
			}
			while ((object)action != action2);
		}
	}

	public Ship()
		: base(-1)
	{
		//IL_0089: Unknown result type (might be due to invalid IL or missing references)
		//IL_008e: Unknown result type (might be due to invalid IL or missing references)
		//IL_0098: Unknown result type (might be due to invalid IL or missing references)
		if (!CommonGlobal.IsServer)
		{
			Corrector = new PositionCorrector();
			PhysicCorrector = new PositionCorrector();
		}
		_007B5026_007D = new TheraEngine.Timer(1000f);
		physicsBody = new ShipPhysics();
		OpenSailesFromIndices = new bool[0];
		_007B5025_007D = new float[0];
		FirstController = new ShipKeyController();
		FalkonetShooting = new DeferredShooting<FalkonetShotInfoRemote>();
		transform = new Transform3D(Vector3.Zero, Vector3.Zero, new Vector3(0.3f));
	}

	internal void Initialize(int _007B4975_007D, ShipPositionInfo _007B4976_007D, WorldMapInfo _007B4977_007D)
	{
		//IL_0028: Unknown result type (might be due to invalid IL or missing references)
		//IL_002d: Unknown result type (might be due to invalid IL or missing references)
		//IL_003d: Unknown result type (might be due to invalid IL or missing references)
		//IL_0042: Unknown result type (might be due to invalid IL or missing references)
		//IL_004d: Unknown result type (might be due to invalid IL or missing references)
		//IL_00a0: Unknown result type (might be due to invalid IL or missing references)
		if (_007B4975_007D < -1)
		{
			throw new ArgumentOutOfRangeException("Ship.Initialize() : uID number is not correct");
		}
		uID = _007B4975_007D;
		MapInfo = _007B4977_007D;
		transform.Translation = Vector3.Zero;
		transform.Scales = new Vector3(0.3f);
		transform.RotatesAll = Vector3.Zero;
		transform.Translation.Y = MapInfo.Weather.HeightOnlyHelper(MapInfo, transform.Translation.X, transform.Translation.Z);
		Position = _007B4976_007D.Position;
		Rotation = _007B4976_007D.Rotation;
		basicCapacitySpeedFactor = 1f;
		CheckShip(_007B4980_007D: true);
		InstanceAlive = true;
		UsedShip.hpFactorCached = UsedShip.HpFactor;
		if (UsedShip is NpcShipDynamicInfo npcShipDynamicInfo && npcShipDynamicInfo.Information.Descritpion == NpcType.Empire_Legendary3l && npcShipDynamicInfo.Information.FleetSize <= 1)
		{
			transform.MiddleScale *= 1.22f;
		}
	}

	public virtual void ClearResources()
	{
		InstanceAlive = false;
		ManualLostEvent.Push(new ShipCleanupEventArgs(this, _007B5031_007D: false));
		ManualLostEvent.Clean();
		FirstController.Reset();
		Corrector?.Clean();
		PhysicCorrector?.Clean();
		_007B5027_007D = 0f;
		uID = -1;
		_007B5022_007D = null;
		KilledByFireworks = false;
		UsedShip = null;
		physicsBody.Clean();
		marchModeBonusSpeed = 0f;
		basicCapacitySpeedFactor = 0f;
		MapInfo = null;
		debugSpeedEnabled = false;
		burningSourceUID = -1;
		_007B5026_007D.Ceiling();
		Array.Clear(OpenSailesFromIndices, 0, OpenSailesFromIndices.Length);
		Array.Clear(_007B5025_007D, 0, _007B5025_007D.Length);
		FalkonetShooting.Reset();
	}

	protected internal void Update(ref FrameTime _007B4978_007D)
	{
		//IL_00ce: Unknown result type (might be due to invalid IL or missing references)
		//IL_00d3: Unknown result type (might be due to invalid IL or missing references)
		//IL_00e3: Unknown result type (might be due to invalid IL or missing references)
		//IL_00e8: Unknown result type (might be due to invalid IL or missing references)
		//IL_0488: Unknown result type (might be due to invalid IL or missing references)
		//IL_048e: Unknown result type (might be due to invalid IL or missing references)
		//IL_04ac: Unknown result type (might be due to invalid IL or missing references)
		//IL_04b1: Unknown result type (might be due to invalid IL or missing references)
		//IL_04b6: Unknown result type (might be due to invalid IL or missing references)
		if (UsedShip.DynamicBonus != null)
		{
			UsedShip.DynamicBonus.Loop(ref _007B4978_007D);
		}
		if (CommonGlobal.IsServer)
		{
			ServerWeaponsShooting.Update(ref _007B4978_007D);
		}
		else
		{
			ClientWeaponsShooting.Update(ref _007B4978_007D);
		}
		float num = ((debugSpeedEnabled && this is Player) ? 10f : 1f);
		float _007B5129_007D = num * UsedShip.Mobility;
		float speed = UsedShip.Speed;
		float capacitySpeedFactor = CapacitySpeedFactor;
		float num2 = Math.Max(3f, speed * ((UsedShip.firstHP.bigHoleTime > 0f) ? 0.3f : 1f) * SailSpeedFactor) + Gameplay.StormBonusSpeed(MapInfo.Weather.ExtraWindSpeedEffect(Position), MapInfo.OutsideSeamLevel(Position));
		if (UsedShip.firstHP.FloodingFactor > 0f)
		{
			_007B5129_007D *= 0.6f;
		}
		if (this is Player { GetBattleTimer: >0f } player && player.UsedShipPlayer.CraftFrom.ID == 38)
		{
			num -= 2.5f / player.UsedShipPlayer.CraftFrom.PatSpeed;
		}
		float _007B5128_007D = num2;
		PrevDisplayMaxSpeed = num2 * capacitySpeedFactor;
		FirstController.Update(this, ref _007B4978_007D, ref _007B5128_007D, ref _007B5129_007D, out var _007B5130_007D);
		_007B5128_007D *= capacitySpeedFactor;
		if (this is Player)
		{
			if (IsHaveDestructionTilt)
			{
				float num3 = Geometry.Saturate(Math.Max(0.3f, 0.6f + (physicsBody.NowSpeed - speed) / 7f));
				_007B5027_007D = Math.Min(1f, _007B5027_007D + _007B4978_007D.secElapsed / 8f * num3);
			}
			else
			{
				float num4 = 1f + Math.Max(0f, 1f - physicsBody.NowSpeed / 10f);
				_007B5027_007D = Math.Max(0f, _007B5027_007D - _007B4978_007D.secElapsed / 8f * num4);
			}
		}
		if (FirstController.LinearStateCode == 3 && FirstController.AxisStateCode == 0 && physicsBody.NowSpeed >= physicsBody.PrevMaxSpeedTakingWindAndPaddles - 0.3f && !IsDestroyedOrFlooding)
		{
			marchModeBonusSpeed = Math.Min(MaxExtraMarchSpeed, marchModeBonusSpeed + _007B4978_007D.secElapsed * 0.45f * Math.Max(1f, (num2 + 15f) / 30f) * (1f + UsedShip.SpeedChangeBonus + ((PalyerMarchingModeBonus > 0f) ? 0.2f : 0f)) * (1f - HaveLowhpMarchingSpeedDebuf));
		}
		else if (FirstController.LinearStateCode != 3)
		{
			marchModeBonusSpeed = Math.Max(0f, marchModeBonusSpeed - _007B4978_007D.secElapsed * Gameplay.CShipSpeed3Finish_loss.Item2 / CommonGameConfig.CurrentSettings.ExperimentalShipLinearSpeed);
		}
		else
		{
			marchModeBonusSpeed = Math.Max(0f, marchModeBonusSpeed - _007B4978_007D.secElapsed * Gameplay.CShipSpeed3Finish_loss.Item1 / CommonGameConfig.CurrentSettings.ExperimentalShipLinearSpeed * UsedShip.SpeedLossInMarchingMode * (0.4f + 0.7f * _007B5129_007D / 100f));
		}
		if (FirstController.LinearStateCode == 3)
		{
			marchModeBonusSpeed = Math.Max(2.5f, marchModeBonusSpeed);
		}
		float num5 = Geometry.Saturate(1.33f * SailSpeedFactor * capacitySpeedFactor);
		PrevDisplayMaxSpeedIncMarchMode = PrevDisplayMaxSpeed + MaxExtraMarchSpeed * num5;
		_007B5128_007D += marchModeBonusSpeed * num5;
		float num6 = 1f;
		if (this is Player player2 && MapInfo.IsWorldmap)
		{
			float isInShallowWater = player2.IsInShallowWater;
			if (isInShallowWater > 0f)
			{
				float bilinearCmp = MapInfo.Shallows.GetBilinearCmp(Position + FastNormal * (float)((physicsBody.NowSpeed < 0f) ? (-50) : 50), player2.UsedShipPlayer.CraftFrom.Rank);
				if (bilinearCmp >= isInShallowWater)
				{
					num6 = Math.Max(0.0001f, 1f - isInShallowWater);
					_007B5128_007D *= num6;
				}
			}
		}
		if (UsedShip.StaticInfo.IsBalloon && IsDestroyedOrFlooding)
		{
			_007B5128_007D = 0f;
		}
		if (float.IsNaN(_007B5128_007D))
		{
			throw new InvalidOperationException($"currentMaxSpeed was NaN. multiplier: {capacitySpeedFactor}, shipSpeed: {speed}, capacity factor: {CapacitySpeedFactor}, sail factor: {SailSpeedFactor}");
		}
		physicsBody.Update(this, ref _007B4978_007D, num2, _007B5128_007D, _007B5130_007D, _007B5129_007D, num, num6);
		LastWorld = null;
		if (!CommonGlobal.IsServer)
		{
			PhysicCorrector.Update(this, _007B4978_007D.msElapsed);
			Corrector.Update(this, _007B4978_007D.msElapsed);
		}
		UsedShip.firstHP.OnUpdateEffects(ref _007B4978_007D, this);
		if (UsedShip.firstHP.burningDuration == 0f)
		{
			burningSourceUID = -1;
		}
		if ((UsedShip.firstHP.burningDuration > 0f || UsedShip.firstHP.aliveMicroburning.Size > 0) && _007B5026_007D.Sample(ref _007B4978_007D))
		{
			BurningLoop(UsedShip.firstHP.burningDuration > 0f, (float)UsedShip.firstHP.aliveMicroburning.Size * 4f);
		}
		if (!CommonGlobal.IsServer)
		{
			UsedShip.Cannons.UpdateEffects(ref _007B4978_007D);
		}
		if (_007B5025_007D.Length != OpenSailesFromIndices.Length)
		{
			_007B5025_007D = new float[OpenSailesFromIndices.Length];
		}
		float num7 = Gameplay.CSailAnimDurationSec(this) * 0.66f;
		for (int i = 0; i < OpenSailesFromIndices.Length; i++)
		{
			if (OpenSailesFromIndices[i])
			{
				_007B5025_007D[i] = num7;
			}
			else
			{
				_007B5025_007D[i] = Math.Max(0f, _007B5025_007D[i] - _007B4978_007D.secElapsed);
			}
		}
		if ((UsedShip.StaticInfo.PaddleModelInstances.Size > 0 || UsedShip.StaticInfo.HasSteamWheel) && physicsBody.LastPaddlesSpeedBonus > 3f && physicsBody.WindingDot < 0f)
		{
			for (int j = 0; j < OpenSailesFromIndices.Length; j++)
			{
				OpenSailesFromIndices[j] = false;
			}
		}
		FalkonetShooting.Update(ref _007B4978_007D);
	}

	protected virtual void SetState(ShipCreatePacket _007B4979_007D)
	{
		//IL_0008: Unknown result type (might be due to invalid IL or missing references)
		Position = _007B4979_007D.PositionInfo.Position;
		if (float.IsNaN(_007B4979_007D.NowSpeed))
		{
			throw new Exception();
		}
		physicsBody.NowSpeed = _007B4979_007D.NowSpeed;
		physicsBody.axisInertion = _007B4979_007D.axisInertion;
		Rotation = _007B4979_007D.PositionInfo.Rotation;
		UsedShip.firstHP = _007B4979_007D.NowHP;
		if (_007B4979_007D.NowSailHP.Length != UsedShip.HitboxSailsStrength.Length)
		{
			_007B4979_007D.NowSailHP = new float[UsedShip.HitboxSailsStrength.Length];
			Array.Copy(_007B4979_007D.NowSailHP, UsedShip.HitboxSailsStrength, Math.Min(UsedShip.HitboxSailsStrength.Length, _007B4979_007D.NowSailHP.Length));
		}
		else
		{
			Buffer.BlockCopy(_007B4979_007D.NowSailHP, 0, UsedShip.HitboxSailsStrength, 0, UsedShip.HitboxSailsStrength.Length * 4);
		}
		UsedShip.HitboxSailsStrengthCacheUpdate();
		physicsBody.Initialize(this, MapInfo.Weather);
		UsedShip.Crew = _007B4979_007D.Crew;
	}

	protected void CheckShip(bool _007B4980_007D)
	{
		ShipDynamicInfo askActualShip = AskActualShip;
		if (askActualShip == null && _007B4980_007D)
		{
			throw new ArgumentNullException("AskActualShip " + GetType().Name);
		}
		if (askActualShip != null && askActualShip != UsedShip)
		{
			UsedShip = askActualShip;
			physicsBody.Initialize(this, MapInfo.Weather);
			UpdateSailClotting();
			OnShipUpdated();
		}
	}

	protected virtual void OnShipUpdated()
	{
	}

	public void UpdateSailClotting()
	{
		if (UsedShip.StaticInfo.SailHitboxes.Length != OpenSailesFromIndices.Length)
		{
			OpenSailesFromIndices = new bool[UsedShip.StaticInfo.SailHitboxes.Length];
		}
		else
		{
			Array.Clear(OpenSailesFromIndices, 0, OpenSailesFromIndices.Length);
		}
		if (SailesSpeed2Test)
		{
			Array.Clear(OpenSailesFromIndices, 0, OpenSailesFromIndices.Length);
			Tlist<int> tlist = UsedShip.StaticInfo.Model.SailOpenPriority[1];
			for (int i = 0; i < tlist.Size; i++)
			{
				OpenSailesFromIndices[tlist.Array[i]] = true;
			}
			_007B4982_007D();
			return;
		}
		if (this is Player player)
		{
			if ((player.IsPortEntry && player.Get_ShowSailesInPort) || UsedShip.StaticInfo.Model == null || FirstController.LinearStateCode == 3)
			{
				for (int j = 0; j < UsedShip.StaticInfo.SailHitboxes.Length; j++)
				{
					OpenSailesFromIndices[j] = true;
				}
				_007B4982_007D();
				return;
			}
			int num = ((FirstController.LinearStateCode == 4) ? 1 : (FirstController.LinearStateCode - 1));
			if (num == -1)
			{
				_007B4981_007D();
				return;
			}
			Tlist<int> tlist2 = UsedShip.StaticInfo.Model.SailOpenPriority[num];
			for (int k = 0; k < tlist2.Size; k++)
			{
				OpenSailesFromIndices[tlist2.Array[k]] = true;
			}
		}
		if (this is Npc)
		{
			int linearStateCode = FirstController.LinearStateCode;
			int num2;
			switch (linearStateCode)
			{
			case 3:
			{
				for (int l = 0; l < UsedShip.StaticInfo.SailHitboxes.Length; l++)
				{
					OpenSailesFromIndices[l] = true;
				}
				_007B4982_007D();
				return;
			}
			default:
				num2 = linearStateCode - 1;
				break;
			case 4:
				num2 = 1;
				break;
			}
			int num3 = num2;
			if (num3 == -1)
			{
				_007B4981_007D();
				return;
			}
			Tlist<int> tlist3 = UsedShip.StaticInfo.Model.SailOpenPriority[num3];
			for (int m = 0; m < tlist3.Size; m++)
			{
				OpenSailesFromIndices[tlist3.Array[m]] = true;
			}
		}
		_007B4982_007D();
	}

	private void _007B4981_007D()
	{
		if (FirstController.AxisStateCode != 0 && UsedShip.Mortars.Count == 0)
		{
			OpenSailesFromIndices[UsedShip.StaticInfo.Model.SailOpenPriorityForZeroSpeedManuer] = true;
		}
	}

	private void _007B4982_007D()
	{
		if (UsedShip.HasExtraMortarUpgrade && UsedShip.StaticInfo.SailRemovedWithMortar != null && FirstController.LinearStateCode != 3)
		{
			OpenSailesFromIndices[UsedShip.StaticInfo.SailRemovedWithMortar.SailStrengthIndex] = false;
		}
	}

	public void ForceDestroy(bool _007B4983_007D)
	{
		UsedShip.firstHP.StopFloodingSynchronized();
		UsedShip.firstHP.DestroyedByFloodingFlags = _007B4983_007D;
		DestroyCallback();
		UsedShip.firstHP.DestroyedByFloodingFlags = false;
	}

	public void FullDestructWithoudEvent()
	{
		UsedShip.firstHP.ResetEffects();
		UsedShip.firstHP.StopFloodingSynchronized();
		Stopful();
	}

	public void MakeSimpleDamage(float _007B4984_007D)
	{
		MakeDamage(new DamageData(uID, -1, DamageID.Other, _007B4984_007D, 0f), -1);
	}

	public void MakeSimpleDamageSailes(float _007B4985_007D)
	{
		DamageData _007B4986_007D = new DamageData(uID, -1, DamageID.Other, 0f, _007B4985_007D)
		{
			Flags = SpecificDamageFlags.TotalSailDamage
		};
		MakeDamage(in _007B4986_007D, -1);
	}

	public virtual void MakeDamage(in DamageData _007B4986_007D, int _007B4987_007D)
	{
		//IL_03e6: Unknown result type (might be due to invalid IL or missing references)
		if (_007B4986_007D.HealthDamage < 0f || _007B4986_007D.UDamageToSailes < 0f || float.IsNaN(_007B4986_007D.HealthDamage) || float.IsNaN(_007B4986_007D.UDamageToSailes))
		{
			throw new ArgumentException();
		}
		if (IsDestroyed)
		{
			return;
		}
		if (MapInfo.IsEducationMap && this is Player)
		{
			UsedShip.firstHP.Damage(_007B4986_007D.HealthDamage / 1.5f);
		}
		else if (MapInfo.IsEducationMap && _007B4986_007D.Flags.HasFlag(SpecificDamageFlags.PvPDamage))
		{
			UsedShip.firstHP.Damage(_007B4986_007D.HealthDamage * 1.2f);
		}
		else
		{
			UsedShip.firstHP.Damage(_007B4986_007D.HealthDamage);
		}
		if (UsedShip.firstHP.FloodingFactor > 0f)
		{
			if (_007B4986_007D.SourcePawnType == DamageID.PowderKeg || _007B4986_007D.SourcePawnType == DamageID.MortarShot || (_007B4986_007D.SourcePawnType == DamageID.Burning && UsedShip.firstHP.burningDuration > 0f) || _007B4986_007D.Flags.HasFlag(SpecificDamageFlags.SternDamage) || _007B4986_007D.Flags.HasFlag(SpecificDamageFlags.Fireworks) || (MapInfo.IsEducationMap && UsedShip.MaxHp < 500f))
			{
				UsedShip.firstHP.StopFloodingSynchronized();
			}
			if (_007B4986_007D.SourcePawnType == DamageID.Collision && _007B4987_007D > 0)
			{
				UsedShip.firstHP.ReduceFlooding(_007B4986_007D.HealthDamage / UsedShip.MaxHp);
			}
		}
		marchModeBonusSpeed = Math.Max(0f, marchModeBonusSpeed - _007B4986_007D.HealthDamage / (1f + UsedShip.firstHP.Summary) * 100f - _007B4986_007D.UDamageToSailes * 100f);
		if (_007B4986_007D.Flags.HasFlag(SpecificDamageFlags.SingleSailDamage))
		{
			int sailStrengthIndex = UsedShip.StaticInfo.TrySailByNodeId(_007B4986_007D.CollisionNodeID).SailStrengthIndex;
			UsedShip.HitboxSailsStrength[sailStrengthIndex] = Math.Max(0f, UsedShip.HitboxSailsStrength[sailStrengthIndex] - _007B4986_007D.UDamageToSailes);
			UsedShip.HitboxSailsStrengthCacheUpdate();
			physicsBody.OnSingleSpeedDebuff(0.1f);
		}
		else if (_007B4986_007D.Flags.HasFlag(SpecificDamageFlags.TotalSailDamage))
		{
			for (int i = 0; i < UsedShip.HitboxSailsStrength.Length; i++)
			{
				UsedShip.HitboxSailsStrength[i] = Math.Max(0f, UsedShip.HitboxSailsStrength[i] - _007B4986_007D.UDamageToSailes / UsedShip.StaticInfo.SailByStr(i).WeigthMul);
			}
			UsedShip.HitboxSailsStrengthCacheUpdate();
		}
		if (_007B4986_007D.Flags.HasFlag(SpecificDamageFlags.DebufSpeed))
		{
			physicsBody.OnSingleSpeedDebuff();
		}
		if (_007B4986_007D.Flags.HasFlag(SpecificDamageFlags.CorpusCritical))
		{
			UsedShip.firstHP.bigHoleTime = _007B4986_007D.UCritCorpusTimeSec;
		}
		if (_007B4986_007D.Flags.HasFlag(SpecificDamageFlags.CreateMicroburning))
		{
			UsedShip.firstHP.CreateMicroburning(this, _007B4986_007D.ShipSpaceCollisionPoint, _007B4987_007D);
		}
		if (_007B4986_007D.Flags.HasFlag(SpecificDamageFlags.BurningCritical))
		{
			burningSourceUID = _007B4987_007D;
			UsedShip.firstHP.CreateBurning(_007B4986_007D.UBurningType);
		}
		if (_007B4986_007D.Flags.HasFlag(SpecificDamageFlags.CrewDamage))
		{
			GSI gSI = new GSI();
			int _007B4684_007D;
			for (int j = 0; j < _007B4986_007D.CrewDamage.Length; j++)
			{
				_007B4684_007D = gSI[_007B4986_007D.CrewDamage[j]]++;
			}
			UsedShip.Crew.Remove(gSI, _007B4683_007D: true, out _007B4684_007D);
		}
		if (_007B4986_007D.Flags.HasFlag(SpecificDamageFlags.CannonCritical))
		{
			UsedShip.Cannons.MakeBroken(_007B4986_007D.UCritCannon, _007B4533_007D: false);
		}
		UsedShip.hpFactorCached = UsedShip.HpFactor;
		if (IsDestroyed)
		{
			if (_007B4986_007D.Flags.HasFlag(SpecificDamageFlags.Fireworks))
			{
				KilledByFireworks = true;
			}
			DestroyCallback();
		}
	}

	public void MakeCollisionDamage(ref SingleShipCollisionData _007B4988_007D, bool _007B4989_007D = true)
	{
		//IL_0072: Unknown result type (might be due to invalid IL or missing references)
		//IL_0078: Unknown result type (might be due to invalid IL or missing references)
		//IL_007d: Unknown result type (might be due to invalid IL or missing references)
		//IL_0038: Unknown result type (might be due to invalid IL or missing references)
		//IL_001e: Unknown result type (might be due to invalid IL or missing references)
		if (_007B4989_007D)
		{
			if (_007B4988_007D.SoftCollision)
			{
				PhysicCorrector.PushLinearFast(_007B4988_007D.AngleOffset, _007B4988_007D.PositionOffset);
			}
			else
			{
				PhysicCorrector.PushHard(_007B4988_007D.AngleOffset, _007B4988_007D.PositionOffset);
			}
		}
		else
		{
			transform.Yaw += _007B4988_007D.AngleOffset;
			Geometry.AxisNorm(ref transform.Yaw);
			Position += _007B4988_007D.PositionOffset;
		}
		physicsBody.ChangeSpeed += _007B4988_007D.SpeedAdd;
		if (!IsDestroyed)
		{
			DamageData _007B4986_007D = new DamageData(uID, _007B4988_007D.SourceShipUID, DamageID.Collision, _007B4988_007D.Damage, 0f);
			if (_007B4988_007D.CorpusCrit)
			{
				_007B4986_007D.Flags |= SpecificDamageFlags.CorpusCritical;
				_007B4986_007D.UCritCorpusTimeSec = 10f;
			}
			if (_007B4988_007D.MakeBurning)
			{
				_007B4986_007D.Flags |= SpecificDamageFlags.BurningCritical;
				_007B4986_007D.UBurningType = PredefinedBurningType.InfiniteAllowMening;
			}
			if (_007B4988_007D.UpgradeDestroyFloodingShip)
			{
				_007B4986_007D.Flags |= SpecificDamageFlags.SternDamage;
			}
			MakeDamage(in _007B4986_007D, _007B4988_007D.SourceShipUID);
		}
	}

	public virtual void RestoreHp(float _007B4990_007D)
	{
		if (_007B4990_007D < 0f)
		{
			throw new ArgumentException();
		}
		if (!IsDestroyed)
		{
			float obj = Math.Min(UsedShip.MaxHp - UsedShip.firstHP.Summary, _007B4990_007D);
			UsedShip.firstHP.Restore(_007B4990_007D, UsedShip.MaxHp);
			_007B5022_007D?.Invoke(obj);
			KilledByFireworks = false;
			UsedShip.hpFactorCached = UsedShip.HpFactor;
		}
	}

	public void RestoreSailes(float _007B4991_007D)
	{
		if (_007B4991_007D < 0f)
		{
			throw new ArgumentException();
		}
		if (IsDestroyed)
		{
			return;
		}
		float num = 0f;
		for (int i = 0; i < UsedShip.HitboxSailsStrength.Length; i++)
		{
			if (UsedShip.HitboxSailsStrength[i] < 1f)
			{
				num += 1f;
			}
		}
		if (num > 0f)
		{
			for (int j = 0; j < UsedShip.HitboxSailsStrength.Length; j++)
			{
				UsedShip.HitboxSailsStrength[j] = Math.Min(1f, UsedShip.HitboxSailsStrength[j] + _007B4991_007D / (num * UsedShip.StaticInfo.SailByStr(j).Weight));
			}
			UsedShip.HitboxSailsStrengthCacheUpdate();
		}
	}

	protected virtual void BurningLoop(bool _007B4992_007D, float _007B4993_007D)
	{
	}

	public void ApplyOnMendingLoopMsg(OnMendingLoopMsg _007B4994_007D)
	{
		if (_007B4994_007D.finalVal > 0f)
		{
			RestoreHp(_007B4994_007D.finalVal);
		}
		if (_007B4994_007D.finalValSailes > 0f)
		{
			RestoreSailes(_007B4994_007D.finalValSailes);
		}
		if (_007B4994_007D.stopBigBurning)
		{
			UsedShip.firstHP.BurningFight();
		}
		if (_007B4994_007D.temporalStrength > 0f)
		{
			UsedShip.firstHP.AddTemporalStrength(_007B4994_007D.temporalStrength, UsedShip.MaxHp);
		}
		if (_007B4994_007D.restoreAllWeapons)
		{
			UsedShip.Cannons.RestoreAllBroken(UsedShip.StaticInfo);
		}
		if (_007B4994_007D.resotreUnitsOrNull != null)
		{
			UsedShip.Crew.Add(_007B4994_007D.resotreUnitsOrNull, _007B4677_007D: false);
		}
	}

	public void StartOrStopSteamWheelCoalUsing(bool _007B4995_007D)
	{
		physicsBody.CanUseWheel = !_007B4995_007D;
		if (_007B4995_007D)
		{
			physicsBody.LastPaddlesSpeedBonus = 0f;
		}
	}

	public void CreateBoardingBurning(int _007B4996_007D, PredefinedBurningType _007B4997_007D)
	{
		burningSourceUID = _007B4996_007D;
		UsedShip.firstHP.CreateBurning(_007B4997_007D);
	}

	protected virtual void OnRespawn()
	{
	}

	protected virtual void DestroyCallback()
	{
		FalkonetShooting.Reset();
		UsedShip.firstHP.ResetEffects();
		Stopful();
		ManualLostEvent.Push(new ShipCleanupEventArgs(this, _007B5031_007D: true));
		CheckShip(_007B4980_007D: false);
	}

	public bool SphereCollisionTest(BoundingSphere _007B4998_007D)
	{
		//IL_002b: Unknown result type (might be due to invalid IL or missing references)
		//IL_0054: Unknown result type (might be due to invalid IL or missing references)
		//IL_0059: Unknown result type (might be due to invalid IL or missing references)
		//IL_005e: Unknown result type (might be due to invalid IL or missing references)
		//IL_0089: Unknown result type (might be due to invalid IL or missing references)
		float num = default(float);
		Vector3.DistanceSquared(ref transform.Translation, ref _007B4998_007D.Center, ref num);
		float num2 = UsedShip.StaticInfo.BSRadiusMax + _007B4998_007D.Radius;
		if (num < num2 * num2)
		{
			Vector3 val = transform.Transform3X3(UsedShip.StaticInfo.BSphere.Center);
			Vector3.DistanceSquared(ref transform.Translation, ref _007B4998_007D.Center, ref num);
			num2 = UsedShip.StaticInfo.BSRadius + _007B4998_007D.Radius;
			return num < num2 * num2;
		}
		return false;
	}

	public void CannonBallCollisionTest(CannonBall _007B4999_007D, out ShipAndBallCollisionTestResult _007B5000_007D)
	{
		//IL_000f: Unknown result type (might be due to invalid IL or missing references)
		_007B5000_007D = default(ShipAndBallCollisionTestResult);
		if (SphereCollisionTest(_007B4999_007D.Shape.Sphere))
		{
			LineShapeCollisionTest(_007B4999_007D.Shape, out _007B5000_007D, _007B4999_007D.BallInfo[CannonBallInfoEffects.IgnoreSailes], _007B4999_007D.PassedSailHitboxes);
		}
	}

	public void CheckForCollision(IsleInstance _007B5001_007D, out bool _007B5002_007D)
	{
		//IL_0025: Unknown result type (might be due to invalid IL or missing references)
		//IL_004e: Unknown result type (might be due to invalid IL or missing references)
		//IL_0011: Unknown result type (might be due to invalid IL or missing references)
		//IL_0016: Unknown result type (might be due to invalid IL or missing references)
		//IL_0061: Unknown result type (might be due to invalid IL or missing references)
		if (CommonGlobal.IsServer)
		{
			Vector3 translation = transform.Translation;
		}
		else
		{
			ShipPositionInfo createServerTransform = CreateServerTransform;
			Vector3 translation = default(Vector3);
			translation.X = createServerTransform.Position.X;
			translation.Y = transform.Translation.Y;
			translation.Z = createServerTransform.Position.Y;
		}
		_007B5002_007D = SphereCollisionTest(_007B5001_007D.ModelGlobalBS);
	}

	private bool _007B5003_007D(int _007B5004_007D)
	{
		return _007B5004_007D < _007B5025_007D.Length && _007B5025_007D[_007B5004_007D] > 0f;
	}

	private void LineShapeCollisionTest(LineShape _007B5005_007D, out ShipAndBallCollisionTestResult _007B5006_007D, bool _007B5007_007D, Tlist<byte> _007B5008_007D = null)
	{
		//IL_003e: Unknown result type (might be due to invalid IL or missing references)
		//IL_0043: Unknown result type (might be due to invalid IL or missing references)
		//IL_002a: Unknown result type (might be due to invalid IL or missing references)
		//IL_006f: Unknown result type (might be due to invalid IL or missing references)
		//IL_0107: Unknown result type (might be due to invalid IL or missing references)
		//IL_01f8: Unknown result type (might be due to invalid IL or missing references)
		//IL_01fd: Unknown result type (might be due to invalid IL or missing references)
		//IL_0200: Unknown result type (might be due to invalid IL or missing references)
		//IL_0205: Unknown result type (might be due to invalid IL or missing references)
		//IL_027b: Unknown result type (might be due to invalid IL or missing references)
		//IL_028b: Unknown result type (might be due to invalid IL or missing references)
		//IL_0290: Unknown result type (might be due to invalid IL or missing references)
		//IL_029b: Unknown result type (might be due to invalid IL or missing references)
		//IL_02a0: Unknown result type (might be due to invalid IL or missing references)
		//IL_02a5: Unknown result type (might be due to invalid IL or missing references)
		//IL_02a9: Unknown result type (might be due to invalid IL or missing references)
		//IL_02ae: Unknown result type (might be due to invalid IL or missing references)
		//IL_02b0: Unknown result type (might be due to invalid IL or missing references)
		//IL_02b5: Unknown result type (might be due to invalid IL or missing references)
		//IL_02bc: Unknown result type (might be due to invalid IL or missing references)
		//IL_02c1: Unknown result type (might be due to invalid IL or missing references)
		//IL_02c3: Unknown result type (might be due to invalid IL or missing references)
		//IL_02c8: Unknown result type (might be due to invalid IL or missing references)
		//IL_030a: Unknown result type (might be due to invalid IL or missing references)
		//IL_030f: Unknown result type (might be due to invalid IL or missing references)
		//IL_0311: Unknown result type (might be due to invalid IL or missing references)
		//IL_0316: Unknown result type (might be due to invalid IL or missing references)
		//IL_031d: Unknown result type (might be due to invalid IL or missing references)
		//IL_0322: Unknown result type (might be due to invalid IL or missing references)
		//IL_0324: Unknown result type (might be due to invalid IL or missing references)
		//IL_0329: Unknown result type (might be due to invalid IL or missing references)
		//IL_0353: Unknown result type (might be due to invalid IL or missing references)
		//IL_03f4: Unknown result type (might be due to invalid IL or missing references)
		//IL_03f6: Unknown result type (might be due to invalid IL or missing references)
		//IL_03fc: Unknown result type (might be due to invalid IL or missing references)
		//IL_03fe: Unknown result type (might be due to invalid IL or missing references)
		//IL_03b2: Unknown result type (might be due to invalid IL or missing references)
		_007B5006_007D = default(ShipAndBallCollisionTestResult);
		Matrix _007B14801_007D;
		if (!LastWorld.HasValue)
		{
			transform.CreateWorldMatrix(out _007B14801_007D);
			LastWorld = _007B14801_007D;
		}
		else
		{
			_007B14801_007D = LastWorld.Value;
		}
		Matrix _007B65_007D = default(Matrix);
		Matrix.Invert(ref _007B14801_007D, ref _007B65_007D);
		bool flag = false;
		CollisionCore.RayWithBox(_007B5005_007D, UsedShip.StaticInfo.CorpusShape, ref _007B65_007D, ref _007B14801_007D, transform.Scales, CollisionTestQuality.Full, out var _007B69_007D);
		if (_007B69_007D.IsCollide)
		{
			_007B5006_007D.NodeID = UsedShip.StaticInfo.CorpusHitbox.CollisionNodeID;
			_007B5006_007D.NodeType = UsedShip.StaticInfo.CorpusHitbox.Type;
			_007B5006_007D.BasicResult = _007B69_007D;
		}
		else
		{
			if (_007B5007_007D)
			{
				return;
			}
			for (int i = 0; i < UsedShip.StaticInfo.MastHitboxes.Length; i++)
			{
				MastHitbox mastHitbox = UsedShip.StaticInfo.MastHitboxes[i];
				CollisionCore.RayWithBox(_007B5005_007D, mastHitbox.Shape, ref _007B65_007D, ref _007B14801_007D, transform.Scales, CollisionTestQuality.Full, out _007B69_007D);
				if (_007B69_007D.IsCollide)
				{
					_007B5006_007D.NodeID = mastHitbox.CollisionNodeID;
					_007B5006_007D.NodeType = mastHitbox.Type;
					_007B5006_007D.BasicResult = _007B69_007D;
					return;
				}
			}
			if (_007B5008_007D != null && _007B5008_007D.Size >= 3)
			{
				return;
			}
			Matrix val2 = default(Matrix);
			for (int j = 0; j < UsedShip.StaticInfo.SailHitboxes.Length; j++)
			{
				SailHitbox sailHitbox = UsedShip.StaticInfo.SailHitboxes[j];
				if (UsedShip.HitboxSailsStrength[sailHitbox.SailStrengthIndex] == 0f || (_007B5008_007D != null && _007B5008_007D.IndexOf(in sailHitbox.CollisionNodeID) != -1))
				{
					continue;
				}
				Vector3 start = _007B5005_007D.start;
				Vector3 end = _007B5005_007D.end;
				float radius = _007B5005_007D.radius;
				bool flag2 = false;
				bool flag3 = false;
				if (!_007B5003_007D(j))
				{
					_007B5005_007D.start.Y -= 0.5f;
					_007B5005_007D.end.Y -= 0.5f;
					_007B5005_007D.radius *= 0.2f;
					flag2 = true;
					flag3 = true;
				}
				if (sailHitbox.IsSailAnimated)
				{
					Vector3 val = (sailHitbox.ModelSpaceRotationPivot * transform.MiddleScale).X0Y() + transform.Translation;
					_007B5005_007D.start -= val;
					_007B5005_007D.end -= val;
					Matrix.CreateRotationY(physicsBody.SailRotation, ref val2);
					Vector3.Transform(ref _007B5005_007D.start, ref val2, ref _007B5005_007D.start);
					Vector3.Transform(ref _007B5005_007D.end, ref val2, ref _007B5005_007D.end);
					_007B5005_007D.start += val;
					_007B5005_007D.end += val;
					flag2 = true;
				}
				if (flag2)
				{
					_007B5005_007D.OnUpdate();
				}
				CollisionCore.RayWithBox(_007B5005_007D, sailHitbox.CommonShape, ref _007B65_007D, ref _007B14801_007D, transform.Scales, CollisionTestQuality.Full, out _007B69_007D);
				if (_007B69_007D.IsCollide)
				{
					_007B69_007D = default(CollisionTestResult);
					for (int k = 0; k < sailHitbox.Shape.Length; k++)
					{
						if (!flag3 || k == 3)
						{
							BoxShape boxShape = sailHitbox.Shape[k];
							CollisionCore.RayWithBox(_007B5005_007D, sailHitbox.CommonShape, ref _007B65_007D, ref _007B14801_007D, transform.Scales, CollisionTestQuality.Full, out _007B69_007D);
							if (_007B69_007D.IsCollide)
							{
								break;
							}
						}
					}
				}
				if (flag2)
				{
					_007B5005_007D.start = start;
					_007B5005_007D.end = end;
					_007B5005_007D.radius = radius;
					_007B5005_007D.OnUpdate();
				}
				if (_007B69_007D.IsCollide)
				{
					_007B5006_007D.NodeID = sailHitbox.CollisionNodeID;
					_007B5006_007D.NodeType = (flag3 ? HitboxType.ServerOnly_SailClosed : HitboxType.Sail);
					_007B5006_007D.BasicResult = _007B69_007D;
					break;
				}
				flag2 = false;
				flag3 = false;
			}
		}
	}

	public void PhysicsEngineShipsTest(Ship _007B5009_007D, out CollisionTestResult _007B5010_007D)
	{
		CollisionCore.BoxWithBox(_007B5009_007D.UsedShip.StaticInfo.CorpusShape, UsedShip.StaticInfo.CorpusShape, _007B5009_007D.transform, transform, CollisionTestQuality.Full, out _007B5010_007D);
	}

	public ShipPositionInfo ReconstructPosition(float _007B5011_007D, ShipPositionInfo _007B5012_007D)
	{
		//IL_000f: Unknown result type (might be due to invalid IL or missing references)
		//IL_0014: Unknown result type (might be due to invalid IL or missing references)
		//IL_001b: Unknown result type (might be due to invalid IL or missing references)
		//IL_0020: Unknown result type (might be due to invalid IL or missing references)
		//IL_0024: Unknown result type (might be due to invalid IL or missing references)
		//IL_002e: Unknown result type (might be due to invalid IL or missing references)
		//IL_0037: Unknown result type (might be due to invalid IL or missing references)
		//IL_0050: Unknown result type (might be due to invalid IL or missing references)
		//IL_005a: Unknown result type (might be due to invalid IL or missing references)
		//IL_0063: Unknown result type (might be due to invalid IL or missing references)
		//IL_00a7: Unknown result type (might be due to invalid IL or missing references)
		float num = _007B5011_007D / 1000f;
		Vector2 velocityPerSec = physicsBody.VelocityPerSec;
		Vector2 accelerationPerSec = physicsBody.AccelerationPerSec;
		Vector2 _007B5191_007D = default(Vector2);
		_007B5191_007D.X = _007B5012_007D.Position.X + velocityPerSec.X * num + accelerationPerSec.X * num * num * 0.5f;
		_007B5191_007D.Y = _007B5012_007D.Position.Y + velocityPerSec.Y * num + accelerationPerSec.Y * num * num * 0.5f;
		float num2 = physicsBody.AngularVelocity * 1000f / 16f;
		float _007B5192_007D = _007B5012_007D.Rotation + num2 * num;
		Geometry.AxisNorm(ref _007B5192_007D);
		return new ShipPositionInfo(_007B5191_007D, _007B5192_007D);
	}

	public Vector2[] GetPowderkegThrowPosition(PowderKegInfo _007B5013_007D)
	{
		return GetPowderkegThrowPosition(_007B5013_007D.KegsCount, _007B5013_007D.TriggerRadius * (1f + UsedShip.PowderKegIncreaseTriggerRadiusBonus));
	}

	public Vector2[] GetPowderkegThrowPosition(int _007B5014_007D, float _007B5015_007D)
	{
		//IL_001c: Unknown result type (might be due to invalid IL or missing references)
		//IL_0022: Unknown result type (might be due to invalid IL or missing references)
		//IL_0039: Unknown result type (might be due to invalid IL or missing references)
		//IL_003e: Unknown result type (might be due to invalid IL or missing references)
		//IL_0043: Unknown result type (might be due to invalid IL or missing references)
		//IL_006d: Unknown result type (might be due to invalid IL or missing references)
		//IL_0072: Unknown result type (might be due to invalid IL or missing references)
		//IL_00aa: Unknown result type (might be due to invalid IL or missing references)
		//IL_00af: Unknown result type (might be due to invalid IL or missing references)
		//IL_00b3: Unknown result type (might be due to invalid IL or missing references)
		//IL_00b7: Unknown result type (might be due to invalid IL or missing references)
		//IL_00ce: Unknown result type (might be due to invalid IL or missing references)
		//IL_00d3: Unknown result type (might be due to invalid IL or missing references)
		//IL_00d8: Unknown result type (might be due to invalid IL or missing references)
		//IL_00df: Unknown result type (might be due to invalid IL or missing references)
		//IL_00e3: Unknown result type (might be due to invalid IL or missing references)
		//IL_00fa: Unknown result type (might be due to invalid IL or missing references)
		//IL_00ff: Unknown result type (might be due to invalid IL or missing references)
		//IL_0104: Unknown result type (might be due to invalid IL or missing references)
		//IL_0133: Unknown result type (might be due to invalid IL or missing references)
		//IL_0138: Unknown result type (might be due to invalid IL or missing references)
		//IL_0174: Unknown result type (might be due to invalid IL or missing references)
		//IL_0179: Unknown result type (might be due to invalid IL or missing references)
		//IL_017e: Unknown result type (might be due to invalid IL or missing references)
		//IL_0183: Unknown result type (might be due to invalid IL or missing references)
		//IL_019a: Unknown result type (might be due to invalid IL or missing references)
		//IL_019f: Unknown result type (might be due to invalid IL or missing references)
		//IL_01a4: Unknown result type (might be due to invalid IL or missing references)
		//IL_01ac: Unknown result type (might be due to invalid IL or missing references)
		//IL_01b1: Unknown result type (might be due to invalid IL or missing references)
		//IL_01c8: Unknown result type (might be due to invalid IL or missing references)
		//IL_01cd: Unknown result type (might be due to invalid IL or missing references)
		//IL_01d2: Unknown result type (might be due to invalid IL or missing references)
		//IL_01da: Unknown result type (might be due to invalid IL or missing references)
		//IL_01df: Unknown result type (might be due to invalid IL or missing references)
		//IL_01f6: Unknown result type (might be due to invalid IL or missing references)
		//IL_01fb: Unknown result type (might be due to invalid IL or missing references)
		//IL_0200: Unknown result type (might be due to invalid IL or missing references)
		//IL_0230: Unknown result type (might be due to invalid IL or missing references)
		//IL_0235: Unknown result type (might be due to invalid IL or missing references)
		//IL_02a7: Unknown result type (might be due to invalid IL or missing references)
		//IL_02ac: Unknown result type (might be due to invalid IL or missing references)
		//IL_02b1: Unknown result type (might be due to invalid IL or missing references)
		//IL_02b6: Unknown result type (might be due to invalid IL or missing references)
		//IL_02d3: Unknown result type (might be due to invalid IL or missing references)
		//IL_02d8: Unknown result type (might be due to invalid IL or missing references)
		//IL_02dd: Unknown result type (might be due to invalid IL or missing references)
		//IL_02e5: Unknown result type (might be due to invalid IL or missing references)
		//IL_02ea: Unknown result type (might be due to invalid IL or missing references)
		//IL_0307: Unknown result type (might be due to invalid IL or missing references)
		//IL_030c: Unknown result type (might be due to invalid IL or missing references)
		//IL_0311: Unknown result type (might be due to invalid IL or missing references)
		//IL_0319: Unknown result type (might be due to invalid IL or missing references)
		//IL_031e: Unknown result type (might be due to invalid IL or missing references)
		//IL_033b: Unknown result type (might be due to invalid IL or missing references)
		//IL_0340: Unknown result type (might be due to invalid IL or missing references)
		//IL_0345: Unknown result type (might be due to invalid IL or missing references)
		//IL_034d: Unknown result type (might be due to invalid IL or missing references)
		//IL_0352: Unknown result type (might be due to invalid IL or missing references)
		//IL_036f: Unknown result type (might be due to invalid IL or missing references)
		//IL_0374: Unknown result type (might be due to invalid IL or missing references)
		//IL_0379: Unknown result type (might be due to invalid IL or missing references)
		switch (_007B5014_007D)
		{
		case 1:
			_007B5015_007D += 2f;
			return (Vector2[])(object)new Vector2[1] { Position - FastNormal * (UsedShip.StaticInfo.CorpusHalfLength + _007B5015_007D) };
		case 2:
		{
			_007B5015_007D += 1f;
			Vector2[] array3 = (Vector2[])(object)new Vector2[2]
			{
				FastNormal,
				default(Vector2)
			};
			Geometry.RotateVector2(ref array3[0], -0.4f, ref array3[1]);
			Geometry.RotateVector2(ref array3[0], 0.4f, ref array3[0]);
			Vector2 position3 = Position;
			array3[0] = position3 - array3[0] * (UsedShip.StaticInfo.CorpusHalfLength + _007B5015_007D);
			array3[1] = position3 - array3[1] * (UsedShip.StaticInfo.CorpusHalfLength + _007B5015_007D);
			return array3;
		}
		case 3:
		{
			_007B5015_007D += 3f;
			Vector2[] array2 = (Vector2[])(object)new Vector2[3]
			{
				FastNormal,
				default(Vector2),
				default(Vector2)
			};
			Geometry.RotateVector2(ref array2[0], -0.6f, ref array2[1]);
			Geometry.RotateVector2(ref array2[0], 0.6f, ref array2[2]);
			Vector2 position2 = Position;
			array2[0] = position2 - array2[0] * (UsedShip.StaticInfo.CorpusHalfLength + _007B5015_007D);
			array2[1] = position2 - array2[1] * (UsedShip.StaticInfo.CorpusHalfLength + _007B5015_007D);
			array2[2] = position2 - array2[2] * (UsedShip.StaticInfo.CorpusHalfLength + _007B5015_007D);
			return array2;
		}
		case 4:
		{
			_007B5015_007D += 2.5f;
			Vector2[] array = (Vector2[])(object)new Vector2[4]
			{
				FastNormal,
				default(Vector2),
				default(Vector2),
				default(Vector2)
			};
			Geometry.RotateVector2(ref array[0], -0.7f, ref array[1]);
			Geometry.RotateVector2(ref array[0], 0.7f, ref array[2]);
			Geometry.RotateVector2(ref array[0], -0.3f, ref array[3]);
			Geometry.RotateVector2(ref array[0], 0.3f, ref array[0]);
			Vector2 position = Position;
			array[0] = position - array[0] * (UsedShip.StaticInfo.CorpusHalfLength + _007B5015_007D + 5f);
			array[1] = position - array[1] * (UsedShip.StaticInfo.CorpusHalfLength + _007B5015_007D - 1f);
			array[2] = position - array[2] * (UsedShip.StaticInfo.CorpusHalfLength + _007B5015_007D - 1f);
			array[3] = position - array[3] * (UsedShip.StaticInfo.CorpusHalfLength + _007B5015_007D + 5f);
			return array;
		}
		default:
			throw new NotSupportedException("GetPowderkegThrowPosition, count: " + _007B5014_007D);
		}
	}

	public static void GetCloseToTheShip(Ship _007B5016_007D, Ship _007B5017_007D)
	{
		//IL_0012: Unknown result type (might be due to invalid IL or missing references)
		//IL_0028: Unknown result type (might be due to invalid IL or missing references)
		//IL_002d: Unknown result type (might be due to invalid IL or missing references)
		//IL_0032: Unknown result type (might be due to invalid IL or missing references)
		//IL_00a8: Unknown result type (might be due to invalid IL or missing references)
		//IL_00ae: Unknown result type (might be due to invalid IL or missing references)
		//IL_00ea: Unknown result type (might be due to invalid IL or missing references)
		//IL_00ec: Unknown result type (might be due to invalid IL or missing references)
		//IL_00f6: Unknown result type (might be due to invalid IL or missing references)
		//IL_00fb: Unknown result type (might be due to invalid IL or missing references)
		//IL_0128: Unknown result type (might be due to invalid IL or missing references)
		//IL_012d: Unknown result type (might be due to invalid IL or missing references)
		//IL_012f: Unknown result type (might be due to invalid IL or missing references)
		//IL_0117: Unknown result type (might be due to invalid IL or missing references)
		//IL_016a: Unknown result type (might be due to invalid IL or missing references)
		//IL_016f: Unknown result type (might be due to invalid IL or missing references)
		//IL_0171: Unknown result type (might be due to invalid IL or missing references)
		//IL_0154: Unknown result type (might be due to invalid IL or missing references)
		//IL_0156: Unknown result type (might be due to invalid IL or missing references)
		Vector2 val = _007B5017_007D.ReconstructPosition(1500f, _007B5017_007D.GetShipPositionInfo).Position - _007B5016_007D.ReconstructPosition(1500f, _007B5016_007D.GetShipPositionInfo).Position;
		float num = ((Vector2)(ref val)).Length();
		float num2 = _007B5016_007D.UsedShip.StaticInfo.CorpusHalfWidth + _007B5017_007D.UsedShip.StaticInfo.CorpusHalfWidth;
		float num3 = Math.Max(_007B5016_007D.UsedShip.StaticInfo.CorpusHalfLength + _007B5017_007D.UsedShip.StaticInfo.CorpusHalfWidth, _007B5017_007D.UsedShip.StaticInfo.CorpusHalfLength + _007B5016_007D.UsedShip.StaticInfo.CorpusHalfWidth);
		float num4 = MathHelper.Lerp(num3, num2, Math.Abs(Vector2.Dot(_007B5016_007D.FastNormal, _007B5017_007D.FastNormal))) + 3f;
		num -= num4;
		if (!(num < 0f))
		{
			((Vector2)(ref val)).Normalize();
			Vector2 val2 = val * num * 0.4f;
			if (_007B5016_007D.PhysicCorrector != null)
			{
				_007B5016_007D.PhysicCorrector.PushLinear(0f, val2, 3000f);
			}
			else
			{
				_007B5016_007D.Position += val2;
			}
			if (_007B5017_007D.PhysicCorrector != null)
			{
				_007B5017_007D.PhysicCorrector.PushLinear(0f, -val2, 3000f);
			}
			else
			{
				_007B5017_007D.Position -= val2;
			}
		}
	}

	internal void Effect_Jerk()
	{
		if (physicsBody.NowSpeed > 0f)
		{
			physicsBody.NowSpeed += ((physicsBody.NowSpeed < 0f) ? 3 : 4);
		}
	}

	public int MaxUnitPlacesCount(bool _007B5018_007D)
	{
		int num = UsedShip.CrewPlaces;
		if (_007B5018_007D && this is Player)
		{
			num += UsedShip.ExtraCrewLimit;
		}
		return num;
	}

	public Tlist<(Vector3, float)> VisualCrewPositions(int _007B5019_007D)
	{
		ShipStaticInfo staticInfo = UsedShip.StaticInfo;
		if (_007B5019_007D <= staticInfo.CrewPositions.Size)
		{
			return staticInfo.CrewPositions;
		}
		return staticInfo.CrewPositions_Double;
	}

	public void Stopful()
	{
		physicsBody.OnStopful();
		PhysicCorrector?.Clean();
		FirstController.Reset();
	}

	public float DistanceToHitbox(in Vector2 _007B5020_007D)
	{
		//IL_0002: Unknown result type (might be due to invalid IL or missing references)
		//IL_0008: Unknown result type (might be due to invalid IL or missing references)
		//IL_000d: Unknown result type (might be due to invalid IL or missing references)
		//IL_001f: Unknown result type (might be due to invalid IL or missing references)
		//IL_0024: Unknown result type (might be due to invalid IL or missing references)
		//IL_0025: Unknown result type (might be due to invalid IL or missing references)
		//IL_0055: Unknown result type (might be due to invalid IL or missing references)
		Vector2 val = Geometry.RotateVector2(_007B5020_007D - Position, 0f - Rotation + (float)Math.PI / 2f);
		float val2 = MathF.Sqrt(MathF.Pow(Math.Max(Math.Abs(val.X) - UsedShip.StaticInfo.CorpusHalfWidth, 0f), 2f) + MathF.Pow(Math.Max(Math.Abs(val.Y) - UsedShip.StaticInfo.CorpusHalfLength, 0f), 2f));
		return Math.Max(0f, val2);
	}

	public float DistanceToHitbox(in Ship _007B5021_007D)
	{
		//IL_000a: Unknown result type (might be due to invalid IL or missing references)
		//IL_0027: Unknown result type (might be due to invalid IL or missing references)
		//IL_0031: Unknown result type (might be due to invalid IL or missing references)
		//IL_0036: Unknown result type (might be due to invalid IL or missing references)
		//IL_003e: Unknown result type (might be due to invalid IL or missing references)
		//IL_005b: Unknown result type (might be due to invalid IL or missing references)
		//IL_0065: Unknown result type (might be due to invalid IL or missing references)
		//IL_006a: Unknown result type (might be due to invalid IL or missing references)
		//IL_0072: Unknown result type (might be due to invalid IL or missing references)
		//IL_007d: Unknown result type (might be due to invalid IL or missing references)
		//IL_0099: Unknown result type (might be due to invalid IL or missing references)
		//IL_009e: Unknown result type (might be due to invalid IL or missing references)
		//IL_00a6: Unknown result type (might be due to invalid IL or missing references)
		//IL_00b1: Unknown result type (might be due to invalid IL or missing references)
		//IL_00cd: Unknown result type (might be due to invalid IL or missing references)
		//IL_00d2: Unknown result type (might be due to invalid IL or missing references)
		//IL_00ea: Unknown result type (might be due to invalid IL or missing references)
		//IL_00ef: Unknown result type (might be due to invalid IL or missing references)
		//IL_00f4: Unknown result type (might be due to invalid IL or missing references)
		//IL_00f9: Unknown result type (might be due to invalid IL or missing references)
		//IL_00fb: Unknown result type (might be due to invalid IL or missing references)
		//IL_010e: Unknown result type (might be due to invalid IL or missing references)
		//IL_0113: Unknown result type (might be due to invalid IL or missing references)
		//IL_0115: Unknown result type (might be due to invalid IL or missing references)
		//IL_0146: Unknown result type (might be due to invalid IL or missing references)
		Vector2[] array = (Vector2[])(object)new Vector2[4]
		{
			new Vector2(Position.X - _007B5021_007D.UsedShip.StaticInfo.CorpusHalfWidth, Position.Y),
			new Vector2(Position.X + _007B5021_007D.UsedShip.StaticInfo.CorpusHalfWidth, Position.Y),
			new Vector2(Position.X, Position.Y - _007B5021_007D.UsedShip.StaticInfo.CorpusHalfLength),
			new Vector2(Position.X, Position.Y + _007B5021_007D.UsedShip.StaticInfo.CorpusHalfLength)
		};
		float num = float.MaxValue;
		Vector2[] array2 = array;
		foreach (Vector2 val in array2)
		{
			Vector2 val2 = Geometry.RotateVector2(_007B5021_007D.Position - val, 0f - _007B5021_007D.Rotation + (float)Math.PI / 2f);
			float num2 = MathF.Sqrt(MathF.Pow(Math.Max(Math.Abs(val2.X) - UsedShip.StaticInfo.CorpusHalfWidth, 0f), 2f) + MathF.Pow(Math.Max(Math.Abs(val2.Y) - UsedShip.StaticInfo.CorpusHalfLength, 0f), 2f));
			if (num2 < num)
			{
				num = num2;
			}
		}
		return num;
	}

	public override string ToString()
	{
		if (this is Player)
		{
			return "Player: " + ((PlayerShipDynamicInfo)UsedShip).CraftFrom.ShipName;
		}
		return "Nps: " + ((NpcShipDynamicInfo)UsedShip).Information.NpcName;
	}
}
