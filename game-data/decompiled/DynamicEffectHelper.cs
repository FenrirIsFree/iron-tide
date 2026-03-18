using System;
using Common.Game;
using ManualPacketSerialization;
using ManualPacketSerialization.Externs;
using TheraEngine;
using TheraEngine.Collections;

namespace Common.Resources;

public class DynamicEffectHelper : IMPSerializable
{
	private struct TemporaryBonus : IMPSerializable
	{
		public ShipBonusEffect Effect;

		public float Amount;

		public float TimeoutMs;

		public byte ByPowerupItemId;

		private void _007B2680_007D(WriterExtern _007B2681_007D)
		{
			_007B2681_007D.WriteByte((byte)Effect);
			_007B2681_007D.WriteStruct<float>(Amount);
			_007B2681_007D.WriteStruct<float>(TimeoutMs);
			_007B2681_007D.WriteByte(ByPowerupItemId);
		}

		private void _007B2682_007D(WriterExtern _007B2683_007D)
		{
			Effect = (ShipBonusEffect)_007B2683_007D.ReadByte();
			_007B2683_007D.ReadStruct<float>(ref Amount);
			_007B2683_007D.ReadStruct<float>(ref TimeoutMs);
			ByPowerupItemId = _007B2683_007D.ReadByte();
		}
	}

	internal StaticEffectsCalculator Stats;

	private Tlist<TemporaryBonus> _007B2679_007D;

	public int Count => _007B2679_007D.Size;

	public DynamicEffectHelper()
	{
		Stats = new StaticEffectsCalculator();
		_007B2679_007D = new Tlist<TemporaryBonus>(5);
	}

	public void AddEffect(ShipBonusEffect _007B2662_007D, float _007B2663_007D, float _007B2664_007D, byte _007B2665_007D)
	{
		for (int i = 0; i < _007B2679_007D.Size; i++)
		{
			if (_007B2679_007D.Array[i].ByPowerupItemId == _007B2665_007D && _007B2679_007D.Array[i].TimeoutMs != -1f && _007B2679_007D.Array[i].Effect == _007B2662_007D)
			{
				_007B2679_007D.Array[i].TimeoutMs = Math.Max(_007B2679_007D.Array[i].TimeoutMs, _007B2664_007D);
				return;
			}
		}
		Tlist<TemporaryBonus> tlist = _007B2679_007D;
		TemporaryBonus item = new TemporaryBonus
		{
			Amount = _007B2663_007D,
			Effect = _007B2662_007D,
			TimeoutMs = _007B2664_007D,
			ByPowerupItemId = _007B2665_007D
		};
		tlist.Add(in item);
		_007B2674_007D();
	}

	internal void RemoveSameEffect(byte _007B2666_007D)
	{
		for (int i = 0; i < _007B2679_007D.Size; i++)
		{
			if (_007B2679_007D.Array[i].ByPowerupItemId == _007B2666_007D && _007B2679_007D.Array[i].TimeoutMs != -1f)
			{
				_007B2679_007D.FastRemoveAt(i);
				i--;
				_007B2674_007D();
			}
		}
	}

	internal void AddArenaUpgrade(ArenaUpgradeInfo _007B2667_007D)
	{
		Tlist<TemporaryBonus> tlist = _007B2679_007D;
		TemporaryBonus item = new TemporaryBonus
		{
			Amount = _007B2667_007D.Effect.Value,
			Effect = _007B2667_007D.Effect.Type,
			TimeoutMs = -1f,
			ByPowerupItemId = (byte)_007B2667_007D.ID
		};
		tlist.Add(in item);
		_007B2674_007D();
	}

	internal void AddArenaUpgrade(ShipBonus _007B2668_007D)
	{
		Tlist<TemporaryBonus> tlist = _007B2679_007D;
		TemporaryBonus item = new TemporaryBonus
		{
			Amount = _007B2668_007D.Value,
			Effect = _007B2668_007D.Type,
			TimeoutMs = -1f,
			ByPowerupItemId = byte.MaxValue
		};
		tlist.Add(in item);
		_007B2674_007D();
	}

	public byte[] GetCompressedArenaUpgrades()
	{
		byte[] array = new byte[_007B2679_007D.Count((TemporaryBonus _007B2684_007D) => _007B2684_007D.TimeoutMs == -1f)];
		int num = 0;
		for (int num2 = 0; num2 < _007B2679_007D.Size; num2++)
		{
			if (_007B2679_007D.Array[num2].TimeoutMs == -1f)
			{
				array[num++] = _007B2679_007D.Array[num2].ByPowerupItemId;
			}
		}
		return array;
	}

	public void AddArenaUpgrade(byte[] _007B2669_007D)
	{
		foreach (byte _007B3498_007D in _007B2669_007D)
		{
			AddArenaUpgrade(Gameplay.ArenaUpgrades[_007B3498_007D]);
		}
	}

	internal int TotalCountArenaUpgrades()
	{
		return _007B2679_007D.Count((TemporaryBonus _007B2685_007D) => _007B2685_007D.TimeoutMs == -1f);
	}

	internal int CountArenaUpgrade(ArenaUpgradeInfo _007B2670_007D)
	{
		return _007B2679_007D.Count((TemporaryBonus _007B2686_007D) => _007B2686_007D.TimeoutMs == -1f && _007B2686_007D.ByPowerupItemId == _007B2670_007D.ID);
	}

	internal void RemoveAllArenaUpgrdaes()
	{
		bool flag = false;
		for (int i = 0; i < _007B2679_007D.Size; i++)
		{
			if (_007B2679_007D.Array[i].TimeoutMs == -1f)
			{
				_007B2679_007D.FastRemoveAt(i);
				i--;
				flag = true;
			}
		}
		if (flag)
		{
			_007B2674_007D();
		}
	}

	internal void RemoveSpecificArenaUpgrade(in ShipBonus _007B2671_007D)
	{
		bool flag = false;
		for (int i = 0; i < _007B2679_007D.Size; i++)
		{
			if (_007B2679_007D.Array[i].TimeoutMs == -1f && _007B2679_007D.Array[i].Effect == _007B2671_007D.Type && _007B2679_007D.Array[i].Amount == _007B2671_007D.Value)
			{
				_007B2679_007D.FastRemoveAt(i);
				i--;
				flag = true;
			}
		}
		if (flag)
		{
			_007B2674_007D();
		}
	}

	public void Loop(ref FrameTime _007B2672_007D)
	{
		for (int i = 0; i < _007B2679_007D.Size; i++)
		{
			if (_007B2679_007D.Array[i].TimeoutMs != -1f && _007B2672_007D.EvaluteTimerMs2(ref _007B2679_007D.Array[i].TimeoutMs))
			{
				_007B2679_007D.FastRemoveAt(i);
				i--;
				_007B2674_007D();
			}
		}
	}

	public void RemoveEffects(bool _007B2673_007D)
	{
		if (_007B2673_007D)
		{
			_007B2679_007D.Clear();
		}
		else
		{
			for (int i = 0; i < _007B2679_007D.Size; i++)
			{
				if (_007B2679_007D.Array[i].TimeoutMs != -1f)
				{
					_007B2679_007D.FastRemoveAt(i);
					i--;
				}
			}
		}
		_007B2674_007D();
	}

	private void _007B2674_007D()
	{
		Stats.Clear();
		for (int i = 0; i < _007B2679_007D.Size; i++)
		{
			Stats.Add(_007B2679_007D.Array[i].Effect, _007B2679_007D.Array[i].Amount);
		}
	}

	private void _007B2675_007D(WriterExtern _007B2676_007D)
	{
		_007B2676_007D.WriteTlistStruct<TemporaryBonus>(_007B2679_007D);
	}

	private void _007B2677_007D(WriterExtern _007B2678_007D)
	{
		_007B2678_007D.ReadTlistStruct<TemporaryBonus>(out _007B2679_007D);
		_007B2674_007D();
	}
}
