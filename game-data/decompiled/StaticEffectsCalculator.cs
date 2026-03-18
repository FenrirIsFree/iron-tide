using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Runtime.CompilerServices;
using Common.Resources;

namespace Common.Game;

public class StaticEffectsCalculator
{
	[CompilerGenerated]
	private sealed class _003CEnumerateEffects_003Ed__14 : IEnumerable<ShipBonus>, IEnumerable, IEnumerator<ShipBonus>, IEnumerator, IDisposable
	{
		private int _007B5240_007D;

		private ShipBonus _007B5241_007D;

		private int _007B5242_007D;

		public StaticEffectsCalculator _003C_003E4__this;

		private int _007B5243_007D;

		private ShipBonusEffect _007B5244_007D;

		ShipBonus IEnumerator<ShipBonus>.Current
		{
			[DebuggerHidden]
			get
			{
				return _007B5241_007D;
			}
		}

		object IEnumerator.Current
		{
			[DebuggerHidden]
			get
			{
				return _007B5241_007D;
			}
		}

		[DebuggerHidden]
		public _003CEnumerateEffects_003Ed__14(int _007B5235_007D)
		{
			_007B5240_007D = _007B5235_007D;
			_007B5242_007D = Environment.CurrentManagedThreadId;
		}

		[DebuggerHidden]
		private void _007B5236_007D()
		{
			_007B5240_007D = -2;
		}

		void IDisposable.Dispose()
		{
			//ILSpy generated this explicit interface implementation from .override directive in {5236}
			this._007B5236_007D();
		}

		private bool _007B5237_007D()
		{
			int num = _007B5240_007D;
			if (num != 0)
			{
				if (num != 1)
				{
					return false;
				}
				_007B5240_007D = -1;
				goto IL_00ca;
			}
			_007B5240_007D = -1;
			if (_003C_003E4__this._007B5231_007D == null)
			{
				return false;
			}
			_007B5243_007D = 0;
			goto IL_00db;
			IL_00db:
			if (_007B5243_007D < _003C_003E4__this._007B5231_007D.Length)
			{
				if (_003C_003E4__this._007B5231_007D[_007B5243_007D] > 0f)
				{
					_007B5244_007D = (ShipBonusEffect)_007B5243_007D;
					_007B5241_007D = new ShipBonus(_007B5244_007D, percentBonus[(int)_007B5244_007D] ? (100f * _003C_003E4__this._007B5231_007D[_007B5243_007D]) : _003C_003E4__this._007B5231_007D[_007B5243_007D]);
					_007B5240_007D = 1;
					return true;
				}
				goto IL_00ca;
			}
			return false;
			IL_00ca:
			_007B5243_007D++;
			goto IL_00db;
		}

		bool IEnumerator.MoveNext()
		{
			//ILSpy generated this explicit interface implementation from .override directive in {5237}
			return this._007B5237_007D();
		}

		[DebuggerHidden]
		private void _007B5238_007D()
		{
			throw new NotSupportedException();
		}

		void IEnumerator.Reset()
		{
			//ILSpy generated this explicit interface implementation from .override directive in {5238}
			this._007B5238_007D();
		}

		[DebuggerHidden]
		IEnumerator<ShipBonus> IEnumerable<ShipBonus>.GetEnumerator()
		{
			_003CEnumerateEffects_003Ed__14 result;
			if (_007B5240_007D == -2 && _007B5242_007D == Environment.CurrentManagedThreadId)
			{
				_007B5240_007D = 0;
				result = this;
			}
			else
			{
				result = new _003CEnumerateEffects_003Ed__14(0)
				{
					_003C_003E4__this = _003C_003E4__this
				};
			}
			return result;
		}

		[DebuggerHidden]
		private IEnumerator _007B5239_007D()
		{
			return ((IEnumerable<ShipBonus>)this).GetEnumerator();
		}

		IEnumerator IEnumerable.GetEnumerator()
		{
			//ILSpy generated this explicit interface implementation from .override directive in {5239}
			return this._007B5239_007D();
		}
	}

	private static bool[] percentBonus;

	private float[] _007B5231_007D;

	private int _007B5232_007D;

	public float this[ShipBonusEffect _007B5223_007D] => (_007B5231_007D == null) ? 0f : _007B5231_007D[(int)_007B5223_007D];

	static StaticEffectsCalculator()
	{
		ShipBonusEffect[] source = (ShipBonusEffect[])Enum.GetValues(typeof(ShipBonusEffect));
		percentBonus = source.Select((ShipBonusEffect _007B5233_007D) => _007B5233_007D.ToString()[0] == 'P').ToArray();
	}

	public StaticEffectsCalculator()
	{
	}

	public StaticEffectsCalculator(params ShipBonus[] _007B5224_007D)
	{
		for (int i = 0; i < _007B5224_007D.Length; i++)
		{
			ShipBonus _007B5225_007D = _007B5224_007D[i];
			Add(in _007B5225_007D);
		}
	}

	public void Clear()
	{
		if (_007B5232_007D > 0)
		{
			Array.Clear(_007B5231_007D, 0, _007B5231_007D.Length);
		}
		_007B5232_007D = 0;
	}

	public void Add(in ShipBonus _007B5225_007D)
	{
		if (!_007B5225_007D.IsIdentity)
		{
			Add(_007B5225_007D.Type, _007B5225_007D.Value);
		}
	}

	public void Add(in ShipBonus _007B5226_007D, float _007B5227_007D)
	{
		if (!_007B5226_007D.IsIdentity)
		{
			Add(_007B5226_007D.Type, _007B5226_007D.Value * _007B5227_007D);
		}
	}

	public void Add(StaticEffectsCalculator _007B5228_007D)
	{
		if (_007B5228_007D._007B5231_007D != null)
		{
			if (_007B5231_007D == null)
			{
				_007B5231_007D = new float[percentBonus.Length];
			}
			_007B5232_007D++;
			for (int i = 0; i < _007B5228_007D._007B5231_007D.Length; i++)
			{
				_007B5231_007D[i] += _007B5228_007D._007B5231_007D[i];
			}
		}
	}

	public ShipBonus? GetFirstEffect()
	{
		if (_007B5231_007D == null)
		{
			return null;
		}
		for (int i = 0; i < _007B5231_007D.Length; i++)
		{
			if (_007B5231_007D[i] != 0f)
			{
				return new ShipBonus((ShipBonusEffect)i, percentBonus[i] ? (_007B5231_007D[i] * 100f) : _007B5231_007D[i]);
			}
		}
		return null;
	}

	public void Add(ShipBonusEffect _007B5229_007D, float _007B5230_007D)
	{
		if (_007B5229_007D != ShipBonusEffect.Identity)
		{
			if (_007B5231_007D == null)
			{
				_007B5231_007D = new float[percentBonus.Length];
			}
			_007B5231_007D[(int)_007B5229_007D] += (percentBonus[(int)_007B5229_007D] ? (_007B5230_007D / 100f) : _007B5230_007D);
			_007B5232_007D++;
		}
	}

	[IteratorStateMachine(typeof(_003CEnumerateEffects_003Ed__14))]
	public IEnumerable<ShipBonus> EnumerateEffects()
	{
		//yield-return decompiler failed: Method not found
		return new _003CEnumerateEffects_003Ed__14(-2)
		{
			_003C_003E4__this = this
		};
	}
}
