using System;
using Common.Resources;
using Microsoft.Xna.Framework;
using TheraEngine;
using TheraEngine.Helpers;

namespace Common.Game;

public class ShipPhysics
{
	public delegate WorldMapInfo PositionTestMethod(ref Vector2 _007B5166_007D);

	public struct WaterParams
	{
		public float D_WaterPres;

		public float D_GracPres;

		public float D_Deriv;

		public float D_MaxDeriv;

		public static WaterParams Lerp(in WaterParams _007B5172_007D, in WaterParams _007B5173_007D, float _007B5174_007D)
		{
			WaterParams result = default(WaterParams);
			result.D_WaterPres = MathHelper.Lerp(_007B5172_007D.D_WaterPres, _007B5173_007D.D_WaterPres, _007B5174_007D);
			result.D_GracPres = MathHelper.Lerp(_007B5172_007D.D_GracPres, _007B5173_007D.D_GracPres, _007B5174_007D);
			result.D_Deriv = MathHelper.Lerp(_007B5172_007D.D_Deriv, _007B5173_007D.D_Deriv, _007B5174_007D);
			result.D_MaxDeriv = MathHelper.Lerp(_007B5172_007D.D_MaxDeriv, _007B5173_007D.D_MaxDeriv, _007B5174_007D);
			return result;
		}
	}

	public class SupportUnit
	{
		public Vector2 LocalPosition;

		public Vector2 LocalPositionRotated;

		public Vector2 GlobalPosLast;

		public float CurrentHeight;

		public float derivative;

		public float LastD;

		private Vector2 _007B5186_007D;

		public void FirstInit(WorldMapInfo _007B5175_007D, Vector2 _007B5176_007D, Vector2 _007B5177_007D, float _007B5178_007D, WeatherEngine _007B5179_007D)
		{
			//IL_0002: Unknown result type (might be due to invalid IL or missing references)
			//IL_0003: Unknown result type (might be due to invalid IL or missing references)
			//IL_0009: Unknown result type (might be due to invalid IL or missing references)
			//IL_000e: Unknown result type (might be due to invalid IL or missing references)
			LocalPosition = _007B5176_007D;
			bool flag = Vector2.DistanceSquared(_007B5186_007D, _007B5177_007D) > 1f;
			UpdatePos(ref _007B5177_007D, _007B5178_007D);
			if (flag)
			{
				CurrentHeight = _007B5179_007D.HeightOnlyHelper(_007B5175_007D, GlobalPosLast.X, GlobalPosLast.Y);
			}
		}

		public void UpdatePos(ref Vector2 _007B5180_007D, float _007B5181_007D)
		{
			//IL_0003: Unknown result type (might be due to invalid IL or missing references)
			//IL_0008: Unknown result type (might be due to invalid IL or missing references)
			_007B5186_007D = _007B5180_007D;
			Geometry.RotateVector2Fast(ref LocalPosition, _007B5181_007D, ref LocalPositionRotated);
			Vector2.Add(ref _007B5180_007D, ref LocalPositionRotated, ref GlobalPosLast);
		}

		public void UpdateState(ref FrameTime _007B5182_007D, float _007B5183_007D, float _007B5184_007D, in WaterParams _007B5185_007D)
		{
			LastD = CurrentHeight - _007B5183_007D;
			float num = Math.Abs(LastD);
			float num2 = ((LastD < 0f) ? (_007B5184_007D * num * (1f + num) * _007B5185_007D.D_WaterPres) : (num * _007B5185_007D.D_GracPres));
			derivative += num2 * (float)(-Math.Sign(LastD)) * _007B5182_007D.secElapsed;
			derivative = Math.Min(Math.Abs(derivative), _007B5185_007D.D_MaxDeriv) * (float)Math.Sign(derivative);
			CurrentHeight += derivative * _007B5182_007D.secElapsed * _007B5185_007D.D_Deriv;
			if (_007B5182_007D.secElapsed > 0f)
			{
				derivative *= 0.97f;
			}
		}
	}

	public const float DestructionTilt = 0.25f;

	public const float MaxArrisRotate = 0.51f;

	public static WaterParams TestShipParams;

	public static bool TestShipParamsEnable = false;

	private static readonly WaterParams heavyShipParams = new WaterParams
	{
		D_WaterPres = 0.9f,
		D_GracPres = 5.04f,
		D_Deriv = 1.7f,
		D_MaxDeriv = 0.8f
	};

	private static readonly WaterParams liteShipParams = new WaterParams
	{
		D_WaterPres = 1.28f,
		D_GracPres = 4.9f,
		D_Deriv = 5f,
		D_MaxDeriv = 0.36f
	};

	public float NowSpeed;

	public float ChangeSpeed;

	private float _007B5151_007D;

	private float _007B5152_007D;

	public float AngularVelocity;

	public float ArrisRotation;

	public float SailRotation;

	public float SailRotationForw;

	public float SailRotationBack;

	internal float axisInertion;

	internal float snappingAxis;

	private float _007B5153_007D;

	private float _007B5154_007D;

	public float LastPaddlesSpeedBonus;

	public Vector2 AccelerationPerSec;

	public Vector2 VelocityPerSec;

	public Vector2 WaveOffset;

	public float WindingDot;

	public float WindingDotGradientDirection;

	public float LastDriftAmount;

	public float LastWindEffectivity;

	public float ServerCollisionTestVelocity;

	public float PrevMaxSpeedTakingWindAndPaddles;

	public bool CanUseWheel;

	private Vector2 _007B5155_007D;

	private float _007B5156_007D;

	private float _007B5157_007D;

	private float _007B5158_007D;

	public SupportUnit[] SupportUnits;

	private const int unitsCount = 6;

	private float _007B5159_007D;

	private float _007B5160_007D;

	private Vector2 _007B5161_007D;

	private static float[] supportUnitsPressureWater = new float[6] { 2f, 2f, 8f, 8f, 5f, 5f };

	public static bool DisableWind { get; set; } = false;

	public float TiltAxisControl => _007B5157_007D;

	public ShipPhysics()
	{
		SupportUnits = new SupportUnit[6];
		SupportUnits[0] = new SupportUnit();
		SupportUnits[1] = new SupportUnit();
		SupportUnits[2] = new SupportUnit();
		SupportUnits[3] = new SupportUnit();
		SupportUnits[4] = new SupportUnit();
		SupportUnits[5] = new SupportUnit();
	}

	internal void Initialize(Ship _007B5136_007D, WeatherEngine _007B5137_007D)
	{
		//IL_0023: Unknown result type (might be due to invalid IL or missing references)
		//IL_0062: Unknown result type (might be due to invalid IL or missing references)
		//IL_0068: Unknown result type (might be due to invalid IL or missing references)
		//IL_00a3: Unknown result type (might be due to invalid IL or missing references)
		//IL_00a9: Unknown result type (might be due to invalid IL or missing references)
		//IL_00e6: Unknown result type (might be due to invalid IL or missing references)
		//IL_00ec: Unknown result type (might be due to invalid IL or missing references)
		//IL_0128: Unknown result type (might be due to invalid IL or missing references)
		//IL_012e: Unknown result type (might be due to invalid IL or missing references)
		//IL_015c: Unknown result type (might be due to invalid IL or missing references)
		//IL_0162: Unknown result type (might be due to invalid IL or missing references)
		//IL_018f: Unknown result type (might be due to invalid IL or missing references)
		//IL_0195: Unknown result type (might be due to invalid IL or missing references)
		//IL_0245: Unknown result type (might be due to invalid IL or missing references)
		//IL_024a: Unknown result type (might be due to invalid IL or missing references)
		//IL_024f: Unknown result type (might be due to invalid IL or missing references)
		float corpusHalfLength = _007B5136_007D.UsedShip.StaticInfo.CorpusHalfLength;
		_007B5160_007D = _007B5136_007D.UsedShip.StaticInfo.CorpusShape.LocalCenter.X * 0.3f;
		SupportUnits[0].FirstInit(_007B5136_007D.MapInfo, new Vector2(corpusHalfLength * 0.66f + 0.5f + _007B5160_007D, (0f - corpusHalfLength) * 0.17f), _007B5136_007D.Position, _007B5136_007D.Rotation, _007B5137_007D);
		SupportUnits[1].FirstInit(_007B5136_007D.MapInfo, new Vector2(corpusHalfLength * 0.66f + 0.5f + _007B5160_007D, corpusHalfLength * 0.17f), _007B5136_007D.Position, _007B5136_007D.Rotation, _007B5137_007D);
		SupportUnits[2].FirstInit(_007B5136_007D.MapInfo, new Vector2((0f - corpusHalfLength) * 0.66f - 0.5f + _007B5160_007D, (0f - corpusHalfLength) * 0.17f), _007B5136_007D.Position, _007B5136_007D.Rotation, _007B5137_007D);
		SupportUnits[3].FirstInit(_007B5136_007D.MapInfo, new Vector2((0f - corpusHalfLength) * 0.66f - 0.5f + _007B5160_007D, corpusHalfLength * 0.17f), _007B5136_007D.Position, _007B5136_007D.Rotation, _007B5137_007D);
		SupportUnits[4].FirstInit(_007B5136_007D.MapInfo, new Vector2(_007B5160_007D, (0f - corpusHalfLength) * 0.19f), _007B5136_007D.Position, _007B5136_007D.Rotation, _007B5137_007D);
		SupportUnits[5].FirstInit(_007B5136_007D.MapInfo, new Vector2(_007B5160_007D, corpusHalfLength * 0.19f), _007B5136_007D.Position, _007B5136_007D.Rotation, _007B5137_007D);
		_007B5161_007D.X = corpusHalfLength * 0.66f * 2f;
		_007B5161_007D.Y = corpusHalfLength * 0.17f * 2f;
		float num = 11f / 15f;
		supportUnitsPressureWater[0] = 2f * num;
		supportUnitsPressureWater[1] = 2f * num;
		supportUnitsPressureWater[2] = 7f;
		supportUnitsPressureWater[3] = 7f;
		supportUnitsPressureWater[4] = 5f * num;
		supportUnitsPressureWater[5] = 5f * num;
		snappingAxis = _007B5136_007D.transform.Yaw;
		_007B5155_007D = _007B5136_007D.transform.Translation.XZ();
	}

	internal void Clean()
	{
		//IL_0023: Unknown result type (might be due to invalid IL or missing references)
		//IL_0028: Unknown result type (might be due to invalid IL or missing references)
		//IL_0033: Unknown result type (might be due to invalid IL or missing references)
		//IL_003a: Unknown result type (might be due to invalid IL or missing references)
		//IL_003f: Unknown result type (might be due to invalid IL or missing references)
		_007B5159_007D = 1f;
		_007B5158_007D = 0f;
		_007B5157_007D = 0f;
		WaveOffset = Vector2.Zero;
		VelocityPerSec = default(Vector2);
		AccelerationPerSec = Vector2.Zero;
		_007B5151_007D = 0f;
		_007B5152_007D = 0f;
		_007B5153_007D = 0f;
		axisInertion = 0f;
		NowSpeed = 0f;
		LastPaddlesSpeedBonus = 0f;
		_007B5156_007D = 0f;
		ServerCollisionTestVelocity = 0f;
		PrevMaxSpeedTakingWindAndPaddles = 0f;
		CanUseWheel = false;
		DisableWind = false;
	}

	internal void Update(Ship _007B5138_007D, ref FrameTime _007B5139_007D, float _007B5140_007D, float _007B5141_007D, int _007B5142_007D, float _007B5143_007D, float _007B5144_007D, float _007B5145_007D)
	{
		//IL_0022: Unknown result type (might be due to invalid IL or missing references)
		//IL_0027: Unknown result type (might be due to invalid IL or missing references)
		//IL_0031: Unknown result type (might be due to invalid IL or missing references)
		//IL_0056: Unknown result type (might be due to invalid IL or missing references)
		//IL_005b: Unknown result type (might be due to invalid IL or missing references)
		//IL_005d: Unknown result type (might be due to invalid IL or missing references)
		//IL_005f: Unknown result type (might be due to invalid IL or missing references)
		//IL_0061: Unknown result type (might be due to invalid IL or missing references)
		//IL_0063: Unknown result type (might be due to invalid IL or missing references)
		//IL_0082: Unknown result type (might be due to invalid IL or missing references)
		//IL_0087: Unknown result type (might be due to invalid IL or missing references)
		//IL_008c: Unknown result type (might be due to invalid IL or missing references)
		//IL_0189: Unknown result type (might be due to invalid IL or missing references)
		//IL_018b: Unknown result type (might be due to invalid IL or missing references)
		//IL_01be: Unknown result type (might be due to invalid IL or missing references)
		//IL_01bf: Unknown result type (might be due to invalid IL or missing references)
		//IL_01dd: Unknown result type (might be due to invalid IL or missing references)
		//IL_01de: Unknown result type (might be due to invalid IL or missing references)
		//IL_0652: Unknown result type (might be due to invalid IL or missing references)
		//IL_0658: Unknown result type (might be due to invalid IL or missing references)
		//IL_0264: Unknown result type (might be due to invalid IL or missing references)
		//IL_0269: Unknown result type (might be due to invalid IL or missing references)
		//IL_026e: Unknown result type (might be due to invalid IL or missing references)
		//IL_0238: Unknown result type (might be due to invalid IL or missing references)
		//IL_03f4: Unknown result type (might be due to invalid IL or missing references)
		//IL_045b: Unknown result type (might be due to invalid IL or missing references)
		//IL_102c: Unknown result type (might be due to invalid IL or missing references)
		//IL_1031: Unknown result type (might be due to invalid IL or missing references)
		//IL_1068: Unknown result type (might be due to invalid IL or missing references)
		//IL_1092: Unknown result type (might be due to invalid IL or missing references)
		//IL_12e0: Unknown result type (might be due to invalid IL or missing references)
		//IL_12e5: Unknown result type (might be due to invalid IL or missing references)
		//IL_12eb: Unknown result type (might be due to invalid IL or missing references)
		//IL_12f0: Unknown result type (might be due to invalid IL or missing references)
		//IL_116a: Unknown result type (might be due to invalid IL or missing references)
		//IL_116f: Unknown result type (might be due to invalid IL or missing references)
		//IL_1183: Unknown result type (might be due to invalid IL or missing references)
		//IL_11a9: Unknown result type (might be due to invalid IL or missing references)
		//IL_11bd: Unknown result type (might be due to invalid IL or missing references)
		//IL_11cb: Unknown result type (might be due to invalid IL or missing references)
		//IL_11ff: Unknown result type (might be due to invalid IL or missing references)
		//IL_1217: Unknown result type (might be due to invalid IL or missing references)
		//IL_122f: Unknown result type (might be due to invalid IL or missing references)
		//IL_1247: Unknown result type (might be due to invalid IL or missing references)
		//IL_126b: Unknown result type (might be due to invalid IL or missing references)
		//IL_1270: Unknown result type (might be due to invalid IL or missing references)
		//IL_1273: Unknown result type (might be due to invalid IL or missing references)
		//IL_1280: Unknown result type (might be due to invalid IL or missing references)
		//IL_1285: Unknown result type (might be due to invalid IL or missing references)
		//IL_1290: Unknown result type (might be due to invalid IL or missing references)
		//IL_1295: Unknown result type (might be due to invalid IL or missing references)
		//IL_129c: Unknown result type (might be due to invalid IL or missing references)
		//IL_12a1: Unknown result type (might be due to invalid IL or missing references)
		//IL_12a3: Unknown result type (might be due to invalid IL or missing references)
		//IL_12a8: Unknown result type (might be due to invalid IL or missing references)
		//IL_12b8: Unknown result type (might be due to invalid IL or missing references)
		//IL_12cf: Unknown result type (might be due to invalid IL or missing references)
		//IL_1734: Unknown result type (might be due to invalid IL or missing references)
		//IL_176f: Unknown result type (might be due to invalid IL or missing references)
		//IL_1837: Unknown result type (might be due to invalid IL or missing references)
		//IL_1864: Unknown result type (might be due to invalid IL or missing references)
		//IL_17d8: Unknown result type (might be due to invalid IL or missing references)
		//IL_17dd: Unknown result type (might be due to invalid IL or missing references)
		//IL_17e2: Unknown result type (might be due to invalid IL or missing references)
		//IL_17f0: Unknown result type (might be due to invalid IL or missing references)
		//IL_1818: Unknown result type (might be due to invalid IL or missing references)
		//IL_18ab: Unknown result type (might be due to invalid IL or missing references)
		//IL_18b2: Unknown result type (might be due to invalid IL or missing references)
		//IL_199d: Unknown result type (might be due to invalid IL or missing references)
		//IL_19b8: Unknown result type (might be due to invalid IL or missing references)
		//IL_1951: Unknown result type (might be due to invalid IL or missing references)
		//IL_1972: Unknown result type (might be due to invalid IL or missing references)
		//IL_19ec: Unknown result type (might be due to invalid IL or missing references)
		//IL_1a0b: Unknown result type (might be due to invalid IL or missing references)
		//IL_1b0d: Unknown result type (might be due to invalid IL or missing references)
		//IL_1b55: Unknown result type (might be due to invalid IL or missing references)
		//IL_1a69: Unknown result type (might be due to invalid IL or missing references)
		//IL_1a74: Unknown result type (might be due to invalid IL or missing references)
		//IL_1a7e: Unknown result type (might be due to invalid IL or missing references)
		//IL_1a83: Unknown result type (might be due to invalid IL or missing references)
		//IL_1a97: Unknown result type (might be due to invalid IL or missing references)
		//IL_1ab2: Unknown result type (might be due to invalid IL or missing references)
		//IL_1ac8: Unknown result type (might be due to invalid IL or missing references)
		//IL_1ade: Unknown result type (might be due to invalid IL or missing references)
		bool detailPhysics = _007B5138_007D.DetailPhysics;
		bool flag = _007B5138_007D.FirstController.LinearStateCode == 4;
		Vector2 windXZNormal = _007B5138_007D.MapInfo.Weather.WindXZNormal;
		Player player = _007B5138_007D as Player;
		Vector2 val = default(Vector2);
		float num = 0f;
		if (_007B5138_007D.MapInfo.WindEnable && detailPhysics)
		{
			Vector2 fastNormal = _007B5138_007D.FastNormal;
			Vector2 val2 = fastNormal;
			val2 += windXZNormal * (_007B5138_007D.UsedShip.StaticInfo.HasUniqueWindRose ? 0.94f : 0.75f);
			((Vector2)(ref val2)).Normalize();
			Vector2.Dot(ref val2, ref windXZNormal, ref WindingDot);
			if (_007B5138_007D.UsedShip.StaticInfo.HasUniqueWindRose)
			{
				float num2 = ((WindingDot > 0.95f) ? (1f - Geometry.InverseLerp(0.95f, 1f, WindingDot)) : 1f);
				WindingDotGradientDirection = ((!(num2 < WindingDot)) ? 1 : (-1));
				WindingDot = Math.Min(WindingDot, num2);
			}
			else
			{
				WindingDotGradientDirection = 1f;
			}
			LastWindEffectivity = (_007B5138_007D.UsedShip.StaticInfo.IsBalloon ? Math.Max(0f, WindingDot) : Math.Min(1f, (WindingDot * 0.5f + 0.5f) * 1.8f + _007B5138_007D.UsedShip.StaticInfo.HardnessFactor * 0.15f));
			Vector2 val3 = fastNormal;
			Vector2 val4 = default(Vector2);
			Geometry.RotateVector2Fast(ref val3, (float)Math.PI / 2f, ref val4);
			float num3 = _007B5151_007D / Gameplay.CSailAnimDurationBasic * Geometry.Saturate(NowSpeed / 12f);
			val.X = (0f - Vector2.Dot(windXZNormal, val4)) * 0.14f * num3 * 1f;
			val.Y = Vector2.Dot(windXZNormal, val3) * 0.02f * num3 * 1f;
			float num4 = 0f;
			if (!_007B5138_007D.UsedShip.StaticInfo.IsBalloon)
			{
				if (LastWindEffectivity < 0.5f)
				{
					num4 = _007B5138_007D.MapInfo.GetRiversLevel(_007B5138_007D.Position);
					LastWindEffectivity = Math.Max(num4 * 0.5f, LastWindEffectivity);
				}
				Vector2 _007B5848_007D = _007B5138_007D.transform.Translation.XZ();
				num = _007B5138_007D.MapInfo.Weather.RainingLevel(in _007B5848_007D);
				if (num > 0f)
				{
					val.X *= 1f + num * 1.2f * Math.Max(num - 0.6f, _007B5152_007D / 8f);
				}
				if (_007B5138_007D.FirstController.LinearStateCode == 3)
				{
					_007B5152_007D = Math.Min(7f, _007B5152_007D + _007B5139_007D.secElapsed);
				}
				else
				{
					_007B5152_007D = Math.Max(0f, _007B5152_007D - 3f * _007B5139_007D.secElapsed);
				}
				_007B5141_007D = ((!flag) ? Math.Max(Math.Min(_007B5141_007D, 2f), _007B5141_007D * (LastWindEffectivity * 0.85f + 0.15f)) : Math.Max(Math.Max(_007B5141_007D, 0f - Gameplay.CBackwindSpeed(_007B5140_007D)), _007B5141_007D * ((1f - WindingDot) * 0.8f + 0.2f)));
			}
			else
			{
				_007B5141_007D = Math.Max(0f, _007B5141_007D * LastWindEffectivity);
			}
			if (player != null && !_007B5138_007D.UsedShip.StaticInfo.IsBalloon && !_007B5138_007D.UsedShip.StaticInfo.HasUniqueWindRose && num4 == 0f)
			{
				if (!_007B5138_007D.UsedShip.DisableWindCourseChange)
				{
					_007B5138_007D.transform.Yaw -= (float)Math.Sign(val.X) * _007B5139_007D.secElapsed * 0.004f;
				}
				if (!_007B5138_007D.UsedShip.StaticInfo.HasSteamWheel && _007B5138_007D.UsedShip.StaticInfo.PaddleModelInstances.Size == 0)
				{
					float num5 = 0.15f;
					_007B5138_007D.transform.Yaw -= (float)Math.Sign(val.X) * _007B5139_007D.secElapsed * Math.Min(0.19f, MathF.Pow(Math.Max(0f, (1f - LastWindEffectivity - num5) / (1f - num5)), 1.7f)) * 0.25f * (1f - MathF.Abs(axisInertion));
				}
			}
		}
		else
		{
			_007B5141_007D = Math.Max(_007B5141_007D, 0f - Gameplay.CBackwindSpeed(_007B5140_007D));
			_007B5152_007D = 0f;
		}
		bool hasSteamWheel = _007B5138_007D.UsedShip.StaticInfo.HasSteamWheel;
		bool flag2 = _007B5138_007D.UsedShip.StaticInfo.PaddleModelInstances.Size > 0;
		if ((flag2 || (hasSteamWheel && LastWindEffectivity < 1f)) && _007B5138_007D.FirstController.LinearStateCode > 0 && _007B5141_007D > 0f)
		{
			float num6 = _007B5138_007D.UsedShip.Speed * _007B5138_007D.basicCapacitySpeedFactor;
			if (player != null)
			{
				num6 = Math.Min(num6, player.UsedShipPlayer.CraftFrom.PatSpeed + 1f);
			}
			num6 *= ((_007B5138_007D.FirstController.LinearStateCode == 1) ? 0.7f : 1f) * Math.Min(1f, _007B5138_007D.basicCapacitySpeedFactor * 1.1f) * (flag2 ? _007B5138_007D.UsedShip.Crew.Effectivity(_007B5138_007D.UsedShip) : 1f);
			num6 += _007B5138_007D.UsedShip.PaddleSpeedExtraBonus;
			LastPaddlesSpeedBonus = Math.Max(0f, num6 - _007B5141_007D);
			float num7 = LastPaddlesSpeedBonus * _007B5145_007D;
			_007B5141_007D = ((!flag2) ? (_007B5141_007D + (CanUseWheel ? num7 : 0f)) : (_007B5141_007D + num7));
		}
		else
		{
			LastPaddlesSpeedBonus = 0f;
		}
		if (detailPhysics)
		{
			float num8 = MathF.Atan2(windXZNormal.Y, windXZNormal.X);
			if (flag)
			{
				num8 += (float)Math.PI;
			}
			float num9 = Geometry.AxisNormFast(_007B5138_007D.transform.Yaw - num8);
			float num10 = Math.Abs(num9);
			if (_007B5142_007D == 0)
			{
				Geometry.Evalute(ref _007B5154_007D, 0f, 0.2f * _007B5139_007D.secElapsed * (0.2f + Math.Abs(_007B5154_007D)));
			}
			else
			{
				float value = (float)Math.PI / 3f * (float)_007B5142_007D * 1.2f;
				Geometry.Evalute(ref _007B5154_007D, Math.Abs(value), 0.2f * _007B5139_007D.secElapsed * (0.2f + (Math.Abs(value) - Math.Abs(_007B5154_007D))));
			}
			Geometry.AngularMovement(ref SailRotation, ((num9 > 0f) ? (-1f) : 1f) * Math.Min(0.8f, num10) * (((float)Math.PI - num10 < 0.5f) ? (((float)Math.PI - num10) / 0.5f) : 1f), 1f * _007B5139_007D.secElapsed);
			float num11 = Geometry.AxisNormFast(num9 + _007B5154_007D);
			float num12 = Geometry.AxisNormFast(num9 - _007B5154_007D);
			float num13 = Math.Abs(num11);
			float num14 = Math.Abs(num12);
			if (_007B5138_007D.UsedShip.StaticInfo.Model.HasPerpendicularBackSail)
			{
				Geometry.AngularMovement(ref SailRotationBack, -0.7f * ((num11 > 0f) ? (-1f) : 1f) * Math.Min(0.8f, 1f) * ((_007B5138_007D.UsedShip.StaticInfo.ID == 56) ? 0.33f : 1f), 1f * _007B5139_007D.secElapsed * 0.5f);
			}
			else
			{
				SailRotationBack = SailRotation;
			}
			Geometry.AngularMovement(ref SailRotationForw, (float)((!_007B5138_007D.UsedShip.StaticInfo.HasUniqueWindRose) ? 1 : (-1)) * ((num12 > 0f) ? (-1f) : 1f) * Math.Min(0.8f, num14) * (((float)Math.PI - num14 < 0.5f) ? (((float)Math.PI - num14) / 0.5f) : 1f), 1f * _007B5139_007D.secElapsed);
		}
		float num15 = 0f;
		if (player != null)
		{
			float num16 = _007B5140_007D * 0.4f;
			float num17 = ((player.UsedShipPlayer.CraftFrom.Rank >= 2) ? 18f : 19f);
			if (_007B5140_007D + 1f > num17)
			{
				num17 = (num17 + _007B5140_007D + 1f) * 0.5f;
			}
			if (NowSpeed - 0.1f > _007B5141_007D && NowSpeed > num16)
			{
				num17 = 0f;
			}
			if (_007B5142_007D != 0 || NowSpeed < num17)
			{
				_007B5153_007D += _007B5139_007D.secElapsed * Math.Min(1.1f, (NowSpeed - num17) * 0.4f) * (0.5f + 0.5f * _007B5138_007D.UsedShip.StaticInfo.InertionFactor / 2f) * ((num17 == 0f) ? 1.5f : 1f);
			}
			if (_007B5142_007D == 0 || NowSpeed < num16)
			{
				_007B5153_007D -= _007B5139_007D.secElapsed * 0.8f;
			}
			_007B5153_007D = Math.Max(0f, Math.Min(3.2f, _007B5153_007D));
			num15 = Math.Max(0f, _007B5153_007D / 2f - 0.6f);
			_007B5143_007D += Math.Max(num15 * 0.3f * Math.Min(_007B5143_007D, 1f) * 100f, 0.2f * (1f - LastWindEffectivity) * (1f - LastWindEffectivity));
			NowSpeed -= num15 * _007B5139_007D.secElapsed * 1.5f * Math.Max(1f, (_007B5140_007D - 10f) / 6f);
			LastDriftAmount = num15;
		}
		if (_007B5138_007D.UsedShip.firstHP.FloodingFactor != 0f)
		{
			_007B5141_007D *= 0.2f;
		}
		float basicSpeed = _007B5138_007D.UsedShip.BasicSpeed;
		if (NowSpeed < _007B5141_007D)
		{
			if (_007B5138_007D.UsedShip.StaticInfo.IsBalloon)
			{
				float num18 = Math.Min(1f, 0.5f + (_007B5141_007D - NowSpeed) / basicSpeed) * Math.Min(1f, 0.17f + Math.Max(0f, NowSpeed * 0.3f));
				NowSpeed += num18 * 1.7f * _007B5139_007D.secElapsed * (1f - num15);
			}
			else
			{
				float num19 = Geometry.Smoothstep(_007B5151_007D / Gameplay.CSailAnimDurationBasic);
				float num20 = Math.Max(0f, _007B5138_007D.UsedShip.Speed - basicSpeed);
				float num21 = Math.Min(1f, 0.22f + (_007B5141_007D - NowSpeed) / basicSpeed * (1f - 1.5f * num20 / basicSpeed));
				float num22 = (0.5f + 0.5f * _007B5138_007D.UsedShip.Crew.Effectivity(_007B5138_007D.UsedShip) * (1f + _007B5138_007D.UsedShip.SpeedChangeBonus) * (0.8f + Math.Max(0f, basicSpeed - 15f) / 9f)) * (Math.Min(1.4f, _007B5138_007D.UsedShip.StaticInfo.InertionFactor) - 0.2f);
				num21 *= CommonGameConfig.CurrentSettings.ExperimentalShipSpeedChange * 4.5f * 0.6f;
				if (_007B5141_007D < 0f)
				{
					num21 *= 0.4f;
				}
				NowSpeed += num22 * num21 * num19 * _007B5139_007D.secElapsed * (1f - num15);
			}
			if (NowSpeed > _007B5141_007D)
			{
				NowSpeed = _007B5141_007D;
			}
			_007B5151_007D = Math.Min(Gameplay.CSailAnimDurationBasic, _007B5151_007D + _007B5139_007D.secElapsed);
		}
		else if (NowSpeed > _007B5141_007D)
		{
			float num23 = (_007B5138_007D.UsedShip.StaticInfo.IsBalloon ? (1.5f * Geometry.Saturate(0.1f + 0.5f * NowSpeed)) : ((3f + Math.Min(3.4f + _007B5138_007D.UsedShip.StaticInfo.InertionFactor * 2f, NowSpeed - _007B5141_007D) * 0.75f) * 0.32f * (2.5f - 1.5f * Geometry.Saturate(NowSpeed / 7.5f)) * (1f + _007B5138_007D.UsedShip.SpeedChangeBonus) * CommonGameConfig.CurrentSettings.ExperimentalShipSpeedChange * (1f + Math.Max(0f, NowSpeed - 17f) * 0.2f)));
			if (_007B5141_007D < 0f)
			{
				num23 *= 0.5f;
			}
			NowSpeed -= num23 * _007B5139_007D.secElapsed * (1f - Math.Min(0.6f, num15));
			if (NowSpeed < _007B5141_007D)
			{
				NowSpeed = _007B5141_007D;
			}
			_007B5151_007D = Math.Max(0f, _007B5151_007D - _007B5139_007D.secElapsed);
		}
		if (ChangeSpeed != 0f)
		{
			float nowSpeed = NowSpeed;
			float num24 = ((Math.Abs(ChangeSpeed) > 2f) ? 15f : 2f);
			Geometry.Evalute(ref NowSpeed, NowSpeed + ChangeSpeed, _007B5139_007D.secElapsed * num24);
			ChangeSpeed = (float)Math.Sign(ChangeSpeed) * Math.Max(0f, Math.Abs(ChangeSpeed) - Math.Abs(NowSpeed - nowSpeed));
		}
		float num25 = ((_007B5142_007D != 0) ? 2f : ((_007B5138_007D is Player) ? 1f : 1.5f)) * 0.6f * _007B5138_007D.UsedShip.StaticInfo.InertionFactor;
		Geometry.Evalute(ref axisInertion, (float)(-_007B5142_007D), (_007B5144_007D > 1f) ? 1f : (_007B5139_007D.secElapsed * num25));
		float num26 = 0.002419f * _007B5143_007D * _007B5139_007D.secElapsed;
		AngularVelocity = num26 * sqrtHelper(axisInertion);
		_007B5138_007D.transform.Yaw += AngularVelocity;
		Geometry.AxisNormFast(ref _007B5138_007D.transform.Yaw);
		if (float.IsNaN(_007B5138_007D.transform.Yaw))
		{
			_007B5138_007D.transform.Yaw = 0f;
		}
		if (float.IsNaN(snappingAxis))
		{
			snappingAxis = 0f;
		}
		Geometry.AngularMovement(ref snappingAxis, _007B5138_007D.transform.Yaw, Math.Min((float)Math.PI / 2f, num26 * (1.4f - num15) / (0.1f + 0.9f * num15)));
		float num27 = _007B5138_007D.UsedShip.StaticInfo.CorpusHalfLength * 1.33f;
		Vector2 fastNormal2 = _007B5138_007D.FastNormal;
		Geometry.RotateVector2Fast(ref fastNormal2, (AngularVelocity > 0f) ? (-(float)Math.PI / 2f) : ((float)Math.PI / 2f), ref fastNormal2);
		_007B5138_007D.transform.Translation.X += fastNormal2.X / num27 * Math.Abs(AngularVelocity);
		_007B5138_007D.transform.Translation.Z += fastNormal2.Y / num27 * Math.Abs(AngularVelocity);
		if (!CommonGlobal.IsServer)
		{
			float num28 = ((NowSpeed < 0f) ? _007B5142_007D : (-_007B5142_007D));
			if (num28 == 0f)
			{
				Geometry.Evalute(ref ArrisRotation, 0f, _007B5139_007D.secElapsed * 0.5f);
			}
			else
			{
				ArrisRotation = MathHelper.Clamp(ArrisRotation - num28 * 0.5f * _007B5139_007D.secElapsed, -0.51f, 0.51f);
			}
		}
		if (NowSpeed != 0f)
		{
			Vector2 val5 = Geometry.SubstructRotateFast(snappingAxis, NowSpeed * _007B5144_007D * CommonGameConfig.CurrentSettings.ExperimentalShipLinearSpeed * 0.00036421f * 1000f);
			Vector2 _007B3047_007D = default(Vector2);
			_007B3047_007D.X = _007B5138_007D.transform.Translation.X + val5.X * _007B5139_007D.secElapsed;
			_007B3047_007D.Y = _007B5138_007D.transform.Translation.Z + val5.Y * _007B5139_007D.secElapsed;
			if (float.IsNaN(_007B3047_007D.X) || float.IsNaN(_007B3047_007D.Y))
			{
				throw new Exception();
			}
			if (_007B5138_007D.MapInfo.IsWorldmap)
			{
				_007B3047_007D.X = Math.Max(-8921.742f, _007B3047_007D.X);
				_007B3047_007D.X = Math.Min(8921.742f, _007B3047_007D.X);
				_007B3047_007D.Y = Math.Max(-10913.06f, _007B3047_007D.Y);
				_007B3047_007D.Y = Math.Min(10913.06f, _007B3047_007D.Y);
			}
			else
			{
				_007B5138_007D.MapInfo.ClampToMap(ref _007B3047_007D);
			}
			Vector2 velocityPerSec = VelocityPerSec;
			VelocityPerSec = (_007B3047_007D - ((Vector3)(ref _007B5138_007D.transform.Translation)).XZ) / _007B5139_007D.secElapsed;
			AccelerationPerSec = VelocityPerSec - velocityPerSec;
			_007B5138_007D.transform.Translation.X = _007B3047_007D.X;
			_007B5138_007D.transform.Translation.Z = _007B3047_007D.Y;
		}
		else
		{
			VelocityPerSec = Vector2.Zero;
			AccelerationPerSec = Vector2.Zero;
		}
		if (detailPhysics)
		{
			Vector2 _007B5856_007D = default(Vector2);
			((Vector2)(ref _007B5856_007D))._002Ector(_007B5138_007D.transform.Translation.X, _007B5138_007D.transform.Translation.Z);
			Vector3 val6 = default(Vector3);
			((Vector3)(ref val6))._002Ector(0f, 1f, 0f);
			_007B5138_007D.transform.Translation.Y = 0f;
			float _007B5859_007D = _007B5138_007D.MapInfo.Weather.WavesHeight(_007B5138_007D.MapInfo, in _007B5856_007D);
			WaterParams _007B5185_007D = (TestShipParamsEnable ? TestShipParams : WaterParams.Lerp(in heavyShipParams, in liteShipParams, _007B5138_007D.UsedShip.StaticInfo.InertionFactor - 1f));
			for (int i = 0; i < 6; i++)
			{
				SupportUnit supportUnit = SupportUnits[i];
				float _007B5183_007D = _007B5138_007D.MapInfo.Weather.HeightOnlyFast(_007B5859_007D, supportUnit.GlobalPosLast.X, supportUnit.GlobalPosLast.Y);
				supportUnit.UpdatePos(ref _007B5856_007D, _007B5138_007D.transform.Yaw);
				supportUnit.UpdateState(ref _007B5139_007D, _007B5183_007D, supportUnitsPressureWater[i], in _007B5185_007D);
				val6.X += (supportUnit.LocalPosition.X - _007B5160_007D) / _007B5161_007D.X * supportUnit.CurrentHeight * 0.6f;
				val6.Z += (supportUnit.LocalPosition.Y - 0f) / _007B5161_007D.Y * supportUnit.CurrentHeight * 0.3f;
				_007B5138_007D.transform.Translation.Y += supportUnit.CurrentHeight;
			}
			val6.X /= 6f;
			val6.Z /= 6f;
			((Vector3)(ref val6)).Normalize();
			float num29 = _007B5138_007D.UsedShip.firstHP.FloodingFactor;
			if (num29 > 0f)
			{
				num29 *= num29;
			}
			float num30 = _007B5138_007D.UsedShip.StaticInfo.WaterlineOffset + 0.1f;
			if (_007B5138_007D.UsedShip.StaticInfo.IsBalloon)
			{
				num30 *= 0.2f + 0.8f * Math.Max(0f, NowSpeed / _007B5140_007D);
			}
			_007B5138_007D.transform.Translation.Y = num30 + _007B5138_007D.transform.Translation.Y / 6f - num29 * (_007B5138_007D.UsedShip.StaticInfo.IsBalloon ? (num30 + 2f) : (_007B5138_007D.UsedShip.StaticInfo.CorpusHalfHeight * 1.2f)) - _007B5138_007D.DestructByTiltAmount * _007B5138_007D.UsedShip.StaticInfo.CorpusHalfHeight * 0.5f - _007B5156_007D;
			Geometry.Evalute(ref _007B5156_007D, Geometry.Saturate(1f - _007B5138_007D.basicCapacitySpeedFactor) * _007B5138_007D.UsedShip.StaticInfo.CorpusHalfHeight * 0.27f, _007B5139_007D.secElapsed * 0.33f);
			switch (_007B5142_007D)
			{
			case 0:
				_007B5157_007D = (float)Math.Sign(_007B5157_007D) * Math.Max(0f, Math.Abs(_007B5157_007D) - _007B5139_007D.secElapsed);
				break;
			case 1:
				_007B5157_007D -= _007B5139_007D.secElapsed * 0.6f;
				break;
			case -1:
				_007B5157_007D += _007B5139_007D.secElapsed * 0.6f;
				break;
			}
			if (_007B5157_007D < -1f || _007B5157_007D > 1f)
			{
				_007B5157_007D = Math.Sign(_007B5157_007D);
			}
			_007B5158_007D += (_007B5157_007D - _007B5158_007D) * _007B5139_007D.secElapsed / (1f + 2f * Math.Abs(_007B5138_007D.transform.Pitch));
			float uniqueSimulationTime = _007B5138_007D.MapInfo.Weather.UniqueSimulationTime;
			float num31 = Geometry.Saturate(NowSpeed / 10f);
			_007B5138_007D.transform.Pitch = val6.Z * 1.35f + MathF.Sin(uniqueSimulationTime * 1.4f) * 0.017f * 1.1f * (1f - num31);
			_007B5138_007D.transform.Roll = (0f - val6.X) * 0.476f + MathF.Sin(uniqueSimulationTime * -1.5f) * 0.01f * 1.1f;
			if (num29 > 0f)
			{
				Vector2 val7 = ExtensionMethods.Normal(new Vector2(HashHelper.greater(_007B5138_007D.uID) - 0.5f, HashHelper.greater(_007B5138_007D.uID * _007B5138_007D.uID) - 0.5f));
				_007B5138_007D.transform.Pitch += val7.X * num29 * ((float)Math.PI / 2f) * 0.3f;
				_007B5138_007D.transform.Roll += val7.Y * num29 * ((float)Math.PI / 2f) * 0.3f;
			}
			Vector2 val8 = default(Vector2);
			val8.X = sqrtHelper(0f - val6.X) * _007B5139_007D.secElapsed * 0.5f * 1.6f * 1.6f;
			val8.Y = sqrtHelper(val6.Z) * _007B5139_007D.secElapsed * 0.5f * 0.77f * 1.6f;
			if (num > 0f)
			{
				_007B5138_007D.transform.Yaw += num * (val8.X + val8.Y) * 0.15f * _007B5138_007D.UsedShip.StaticInfo.InertionFactor / 2f;
			}
			float num32 = 1f - num31 * 0.5f;
			val8.X *= num32;
			val8.Y *= num32;
			Geometry.RotateVector2Fast(ref val8, _007B5138_007D.transform.Yaw, ref val8);
			if (_007B5138_007D.MapInfo.WindEnable)
			{
				float num33 = Geometry.Saturate(_007B5151_007D / Gameplay.CSailAnimDurationBasic) * 0.67f;
				val8.X += windXZNormal.X * _007B5139_007D.secElapsed * 0.2f * num33;
				val8.Y += windXZNormal.Y * _007B5139_007D.secElapsed * 0.2f * num33;
			}
			_007B5138_007D.transform.Translation.X += val8.X;
			_007B5138_007D.transform.Translation.Z += val8.Y;
			float num34 = Math.Max(num * num31, (NowSpeed > 14f) ? 1 : 0);
			WaveOffset.X += val8.X * (1f - num34);
			WaveOffset.Y += val8.Y * (1f - num34);
			float num35 = 1.2f;
			float num36 = ((Vector2)(ref WaveOffset)).Length();
			if (num36 > num35)
			{
				float num37 = num36 - num35;
				float num38 = MathF.Atan2(WaveOffset.Y, WaveOffset.X);
				Vector2 val9 = Geometry.SubstructRotateFast(num38, num37) * _007B5139_007D.secElapsed * 1.6f;
				_007B5138_007D.transform.Translation.X -= val9.X;
				_007B5138_007D.transform.Translation.Z -= val9.Y;
				WaveOffset.X -= val9.X;
				WaveOffset.Y -= val9.Y;
			}
			float num39 = _007B5158_007D * 0.04f * Math.Min(1f, NowSpeed / 14f);
			float num40 = val.X + num39;
			float num41 = 1f - _007B5138_007D.UsedShip.TiltReduce * 0.8f;
			_007B5138_007D.transform.Pitch += num40 * num41;
			_007B5138_007D.transform.Roll += val.Y * num41;
		}
		_007B5139_007D.EvaluteTimerSec(ref _007B5159_007D);
		if (CommonGlobal.IsServer)
		{
			Vector2 val10 = default(Vector2);
			val10.X = _007B5138_007D.transform.Translation.X - _007B5155_007D.X;
			val10.Y = _007B5138_007D.transform.Translation.Y - _007B5155_007D.Y;
			_007B5155_007D.X = _007B5138_007D.transform.Translation.X;
			_007B5155_007D.Y = _007B5138_007D.transform.Translation.Z;
			ServerCollisionTestVelocity += ((Vector2)(ref val10)).Length();
		}
		PrevMaxSpeedTakingWindAndPaddles = _007B5141_007D;
	}

	private static float sqrtHelper(float _007B5146_007D)
	{
		if (_007B5146_007D > 0f)
		{
			return MathF.Sqrt(_007B5146_007D);
		}
		return 0f - MathF.Sqrt(0f - _007B5146_007D);
	}

	private static float smoothSqrthelper(float _007B5147_007D)
	{
		int num = Math.Sign(_007B5147_007D);
		_007B5147_007D = Math.Abs(_007B5147_007D);
		return MathF.Sqrt(_007B5147_007D) * Math.Min(1f, _007B5147_007D * 5f) * (float)num;
	}

	internal void OnStopful()
	{
		NowSpeed = 0f;
		_007B5158_007D = 0f;
		ChangeSpeed = 0f;
	}

	internal void PushRadialEnergy(Vector2 _007B5148_007D, float _007B5149_007D)
	{
		//IL_0001: Unknown result type (might be due to invalid IL or missing references)
		//IL_0002: Unknown result type (might be due to invalid IL or missing references)
		//IL_002c: Unknown result type (might be due to invalid IL or missing references)
		//IL_0031: Unknown result type (might be due to invalid IL or missing references)
		Vector2 val = _007B5148_007D;
		((Vector2)(ref val)).Normalize();
		float num = default(float);
		for (int i = 0; i < SupportUnits.Length; i++)
		{
			SupportUnit supportUnit = SupportUnits[i];
			if (supportUnit.LastD < 1f)
			{
				Vector2 localPositionRotated = supportUnit.LocalPositionRotated;
				((Vector2)(ref localPositionRotated)).Normalize();
				Vector2.Dot(ref localPositionRotated, ref val, ref num);
				supportUnit.derivative -= num * _007B5149_007D * 0.15f;
			}
		}
	}

	internal void OnSingleSpeedDebuff(float _007B5150_007D = 1f)
	{
		float num = Math.Abs(NowSpeed / 15f);
		NowSpeed = Math.Max(0f, Math.Abs(NowSpeed) - num / (2f + _007B5159_007D) * _007B5150_007D) * (float)Math.Sign(NowSpeed);
		_007B5159_007D += 0.4f;
		_007B5159_007D = Math.Min(5f, _007B5159_007D);
	}
}
