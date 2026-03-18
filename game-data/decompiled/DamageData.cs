using System.Collections.Generic;
using ManualPacketSerialization;
using ManualPacketSerialization.Externs;
using Microsoft.Xna.Framework;

namespace Common.Game;

public struct DamageData : IMPSerializable
{
	public int TargetUID;

	public int SourcePawnOrShipUID;

	public DamageID SourcePawnType;

	public float HealthDamage;

	public byte CollisionNodeID;

	public Vector3 ShipSpaceCollisionPoint;

	public SpecificDamageFlags Flags;

	public PredefinedBurningType UBurningType;

	public float UCritCorpusTimeSec;

	public byte[] CrewDamage;

	public byte UCritCannon;

	public float UDamageToSailes;

	public int TotalCrewKills => ((Flags & SpecificDamageFlags.CrewDamage) == SpecificDamageFlags.CrewDamage) ? CrewDamage.Length : 0;

	public DamageData(int _007B4453_007D, int _007B4454_007D, float _007B4455_007D, Vector3 _007B4456_007D, byte _007B4457_007D)
	{
		//IL_0025: Unknown result type (might be due to invalid IL or missing references)
		//IL_0027: Unknown result type (might be due to invalid IL or missing references)
		this = default(DamageData);
		TargetUID = _007B4453_007D;
		SourcePawnOrShipUID = _007B4454_007D;
		SourcePawnType = DamageID.CannonBall;
		HealthDamage = _007B4455_007D;
		ShipSpaceCollisionPoint = _007B4456_007D;
		CollisionNodeID = _007B4457_007D;
	}

	public DamageData(int _007B4458_007D, int _007B4459_007D, DamageID _007B4460_007D, float _007B4461_007D, float _007B4462_007D)
	{
		this = default(DamageData);
		TargetUID = _007B4458_007D;
		SourcePawnOrShipUID = _007B4459_007D;
		SourcePawnType = _007B4460_007D;
		HealthDamage = _007B4461_007D;
		if (_007B4462_007D > 0f)
		{
			Flags |= SpecificDamageFlags.TotalSailDamage;
			UDamageToSailes = _007B4462_007D;
		}
	}

	public DamageData(int _007B4463_007D, int _007B4464_007D, DamageID _007B4465_007D, float _007B4466_007D, float _007B4467_007D, Vector3 _007B4468_007D)
	{
		//IL_0026: Unknown result type (might be due to invalid IL or missing references)
		//IL_0028: Unknown result type (might be due to invalid IL or missing references)
		this = default(DamageData);
		TargetUID = _007B4463_007D;
		SourcePawnOrShipUID = _007B4464_007D;
		SourcePawnType = _007B4465_007D;
		HealthDamage = _007B4466_007D;
		ShipSpaceCollisionPoint = _007B4468_007D;
		if (_007B4467_007D > 0f)
		{
			Flags |= SpecificDamageFlags.TotalSailDamage;
			UDamageToSailes = _007B4467_007D;
		}
	}

	public void SetCrewDamage(GSI? _007B4469_007D)
	{
		if (_007B4469_007D == null)
		{
			return;
		}
		CrewDamage = new byte[_007B4469_007D.GetTotalItemsCount()];
		int num = 0;
		foreach (GSILocalPair item in (IEnumerable<GSILocalPair>)_007B4469_007D)
		{
			for (int i = 0; i < item.Count; i++)
			{
				CrewDamage[num++] = (byte)item.ID;
			}
		}
		Flags |= SpecificDamageFlags.CrewDamage;
	}

	private void _007B4470_007D(WriterExtern _007B4471_007D)
	{
		_007B4471_007D.WriteStruct<int>(ref SourcePawnOrShipUID);
		_007B4471_007D.WriteStruct<int>(ref TargetUID);
		_007B4471_007D.WriteStruct<float>(ref HealthDamage);
		_007B4471_007D.WriteByte(CollisionNodeID);
		_007B4471_007D.WriteStruct<Vector3>(ref ShipSpaceCollisionPoint);
		_007B4471_007D.WriteStruct<ushort>((ushort)Flags);
		_007B4471_007D.WriteByte((byte)SourcePawnType);
		if ((Flags & SpecificDamageFlags.SingleSailDamage) == SpecificDamageFlags.SingleSailDamage || (Flags & SpecificDamageFlags.TotalSailDamage) == SpecificDamageFlags.TotalSailDamage)
		{
			_007B4471_007D.WriteStruct<float>(UDamageToSailes);
		}
		if ((Flags & SpecificDamageFlags.CannonCritical) == SpecificDamageFlags.CannonCritical)
		{
			_007B4471_007D.WriteByte(UCritCannon);
		}
		if ((Flags & SpecificDamageFlags.CrewDamage) == SpecificDamageFlags.CrewDamage)
		{
			_007B4471_007D.WriteBytes8bitSize(CrewDamage);
		}
		if ((Flags & SpecificDamageFlags.CorpusCritical) == SpecificDamageFlags.CorpusCritical)
		{
			_007B4471_007D.WriteStruct<float>(UCritCorpusTimeSec);
		}
		if ((Flags & SpecificDamageFlags.BurningCritical) == SpecificDamageFlags.BurningCritical)
		{
			_007B4471_007D.WriteByte((byte)UBurningType);
		}
	}

	private void _007B4472_007D(WriterExtern _007B4473_007D)
	{
		_007B4473_007D.ReadStruct<int>(ref SourcePawnOrShipUID);
		_007B4473_007D.ReadStruct<int>(ref TargetUID);
		_007B4473_007D.ReadStruct<float>(ref HealthDamage);
		CollisionNodeID = _007B4473_007D.ReadByte();
		_007B4473_007D.ReadStruct<Vector3>(ref ShipSpaceCollisionPoint);
		ushort flags = default(ushort);
		_007B4473_007D.ReadStruct<ushort>(ref flags);
		Flags = (SpecificDamageFlags)flags;
		SourcePawnType = (DamageID)_007B4473_007D.ReadByte();
		if ((Flags & SpecificDamageFlags.SingleSailDamage) == SpecificDamageFlags.SingleSailDamage || (Flags & SpecificDamageFlags.TotalSailDamage) == SpecificDamageFlags.TotalSailDamage)
		{
			_007B4473_007D.ReadStruct<float>(ref UDamageToSailes);
		}
		if ((Flags & SpecificDamageFlags.CannonCritical) == SpecificDamageFlags.CannonCritical)
		{
			UCritCannon = _007B4473_007D.ReadByte();
		}
		if ((Flags & SpecificDamageFlags.CrewDamage) == SpecificDamageFlags.CrewDamage)
		{
			_007B4473_007D.ReadBytes8bitSize(ref CrewDamage);
		}
		if ((Flags & SpecificDamageFlags.CorpusCritical) == SpecificDamageFlags.CorpusCritical)
		{
			_007B4473_007D.ReadStruct<float>(ref UCritCorpusTimeSec);
		}
		if ((Flags & SpecificDamageFlags.BurningCritical) == SpecificDamageFlags.BurningCritical)
		{
			UBurningType = (PredefinedBurningType)_007B4473_007D.ReadByte();
		}
	}
}
