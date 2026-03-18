using System;
using System.Runtime.CompilerServices;
using CommonDataTypes;
using Microsoft.Xna.Framework;
using TheraEngine;
using TheraEngine.Helpers;

namespace Common.Game;

public abstract class MortarShot : IPoolObject
{
	public static readonly int PowderKegMortarType = 2;

	public int uID;

	public int SenderObjectUID;

	public Vector3 CurrentPosition;

	public MortarShotParameters Shot;

	private float _007B5671_007D;

	private float _007B5672_007D;

	public bool IsWaitingSupermortar => _007B5672_007D > 0f;

	public MortarShot()
	{
	}

	public virtual void ClearResources()
	{
		_007B5671_007D = 0f;
	}

	public void InitializeNewUnit(int _007B5661_007D, int _007B5662_007D, MortarShotParameters _007B5663_007D)
	{
		//IL_0046: Unknown result type (might be due to invalid IL or missing references)
		//IL_004b: Unknown result type (might be due to invalid IL or missing references)
		//IL_0050: Unknown result type (might be due to invalid IL or missing references)
		//IL_0055: Unknown result type (might be due to invalid IL or missing references)
		//IL_00c8: Unknown result type (might be due to invalid IL or missing references)
		//IL_00de: Unknown result type (might be due to invalid IL or missing references)
		//IL_00f0: Unknown result type (might be due to invalid IL or missing references)
		//IL_00f5: Unknown result type (might be due to invalid IL or missing references)
		uID = _007B5661_007D;
		Shot = _007B5663_007D;
		SenderObjectUID = _007B5662_007D;
		Shot.StartPosition.Y = Math.Max(0.1f, Shot.StartPosition.Y);
		Vector2 val = Shot.Direction.XY().Normal();
		float num = 0.3f + 0.7f * HashHelper.greater(((object)Unsafe.As<Vector3, Vector3>(ref Shot.StartPosition)/*cast due to .constrained prefix*/).GetHashCode() - _007B5661_007D);
		float num2 = HashHelper.greater(((object)Unsafe.As<Vector3, Vector3>(ref Shot.StartPosition)/*cast due to .constrained prefix*/).GetHashCode() + _007B5661_007D);
		Geometry.RotateVector2Fast(ref val, num * (float)((num2 > 0.5f) ? 1 : (-1)) * 0.025f, ref val);
		Shot.Direction.X = val.X;
		Shot.Direction.Y = val.Y;
		CurrentPosition = Shot.StartPosition;
		if (_007B5663_007D.BallInfo.ID == 20)
		{
			_007B5672_007D = 3000f;
		}
		FinalInitialize();
	}

	protected abstract void FinalInitialize();

	public virtual bool UpdateBase(ref FrameTime _007B5664_007D)
	{
		//IL_0150: Unknown result type (might be due to invalid IL or missing references)
		//IL_0155: Unknown result type (might be due to invalid IL or missing references)
		_007B5664_007D.EvaluteTimerMs(ref _007B5672_007D);
		if (_007B5672_007D > 0f)
		{
			return false;
		}
		float num = MathHelper.Lerp(Shot.WeaponDistance.X, Shot.WeaponDistance.Y, Shot.Direction.Z);
		_007B5671_007D += _007B5664_007D.secElapsed / 4f * (Shot.WeaponDistance.Y / num) * 1.2f * Shot.BallInfo.Speed * ((Shot.Feature == CannonFeature.HeavyMortar) ? 1.45f : 1f);
		float num2 = 4f * _007B5671_007D * (1f - _007B5671_007D);
		CurrentPosition = new Vector3(Shot.StartPosition.X + Shot.Direction.X * _007B5671_007D * num, Shot.StartPosition.Y * (1f - _007B5671_007D) + num2 * num / 5f, Shot.StartPosition.Z + Shot.Direction.Y * _007B5671_007D * num);
		if (CurrentPosition.Y < 0f)
		{
			return true;
		}
		return false;
	}

	public Vector2 GetFinishPosition()
	{
		//IL_0007: Unknown result type (might be due to invalid IL or missing references)
		//IL_000c: Unknown result type (might be due to invalid IL or missing references)
		//IL_0017: Unknown result type (might be due to invalid IL or missing references)
		//IL_001c: Unknown result type (might be due to invalid IL or missing references)
		//IL_0056: Unknown result type (might be due to invalid IL or missing references)
		//IL_005b: Unknown result type (might be due to invalid IL or missing references)
		//IL_0060: Unknown result type (might be due to invalid IL or missing references)
		//IL_0063: Unknown result type (might be due to invalid IL or missing references)
		return Shot.StartPosition.XZ() + Shot.Direction.XY() * MathHelper.Lerp(Shot.WeaponDistance.X, Shot.WeaponDistance.Y, Shot.Direction.Z);
	}

	public float ComputeDamageFactorTo(Vector2 _007B5665_007D, Vector2 _007B5666_007D, float _007B5667_007D)
	{
		//IL_0001: Unknown result type (might be due to invalid IL or missing references)
		//IL_0002: Unknown result type (might be due to invalid IL or missing references)
		float num = Vector2.Distance(_007B5665_007D, _007B5666_007D);
		if (num > 0f)
		{
			return 0.1f + 0.9f * MathF.Sqrt(1f - Geometry.Saturate(num / _007B5667_007D));
		}
		return 1f;
	}

	public float ComputeDamageFactorTo(Ship _007B5668_007D, Vector2 _007B5669_007D, float _007B5670_007D)
	{
		float num = _007B5668_007D.DistanceToHitbox(in _007B5669_007D) - 1f;
		if (num > 0f)
		{
			return 0.1f + 0.9f * MathF.Sqrt(1f - Geometry.Saturate(num / _007B5670_007D));
		}
		return 1f;
	}
}
