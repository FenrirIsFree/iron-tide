using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using Common.Account;
using Common.Data;
using Common.Resources;
using CommonDataTypes;
using ManualPacketSerialization;
using ManualPacketSerialization.Externs;
using TheraEngine.Collections;
using TheraEngine.Helpers;

namespace Common.Game;

public class UnitCollection : IMPSerializable
{
	public enum Way
	{
		PickCheaper,
		PickExpensive,
		PickRandom
	}

	[CompilerGenerated]
	private sealed class _003CCutEndOfServiceSpecial_003Ed__50 : IEnumerable<UnitInfo>, IEnumerable, IEnumerator<UnitInfo>, IEnumerator, IDisposable
	{
		private int _007B4728_007D;

		private UnitInfo _007B4729_007D;

		private int _007B4730_007D;

		public UnitCollection _003C_003E4__this;

		private bool _007B4731_007D;

		private int _007B4732_007D;

		UnitInfo IEnumerator<UnitInfo>.Current
		{
			[DebuggerHidden]
			get
			{
				return _007B4729_007D;
			}
		}

		object IEnumerator.Current
		{
			[DebuggerHidden]
			get
			{
				return _007B4729_007D;
			}
		}

		[DebuggerHidden]
		public _003CCutEndOfServiceSpecial_003Ed__50(int _007B4723_007D)
		{
			_007B4728_007D = _007B4723_007D;
			_007B4730_007D = Environment.CurrentManagedThreadId;
		}

		[DebuggerHidden]
		private void _007B4724_007D()
		{
			_007B4728_007D = -2;
		}

		void IDisposable.Dispose()
		{
			//ILSpy generated this explicit interface implementation from .override directive in {4724}
			this._007B4724_007D();
		}

		private bool _007B4725_007D()
		{
			int num = _007B4728_007D;
			if (num != 0)
			{
				if (num != 1)
				{
					return false;
				}
				_007B4728_007D = -1;
				_003C_003E4__this._007B4711_007D.RemoveAt(_007B4732_007D);
				_007B4732_007D--;
				_007B4731_007D = true;
				goto IL_00c0;
			}
			_007B4728_007D = -1;
			_007B4731_007D = false;
			_007B4732_007D = 0;
			goto IL_00d1;
			IL_00c0:
			_007B4732_007D++;
			goto IL_00d1;
			IL_00d1:
			if (_007B4732_007D < _003C_003E4__this._007B4711_007D.Size)
			{
				if (_003C_003E4__this._007B4711_007D.Array[_007B4732_007D].LeftContractTimeHours <= 0f)
				{
					_007B4729_007D = _003C_003E4__this._007B4711_007D.Array[_007B4732_007D].GetInfo;
					_007B4728_007D = 1;
					return true;
				}
				goto IL_00c0;
			}
			if (_007B4731_007D)
			{
				_003C_003E4__this.UpdateInformation();
			}
			return false;
		}

		bool IEnumerator.MoveNext()
		{
			//ILSpy generated this explicit interface implementation from .override directive in {4725}
			return this._007B4725_007D();
		}

		[DebuggerHidden]
		private void _007B4726_007D()
		{
			throw new NotSupportedException();
		}

		void IEnumerator.Reset()
		{
			//ILSpy generated this explicit interface implementation from .override directive in {4726}
			this._007B4726_007D();
		}

		[DebuggerHidden]
		IEnumerator<UnitInfo> IEnumerable<UnitInfo>.GetEnumerator()
		{
			_003CCutEndOfServiceSpecial_003Ed__50 result;
			if (_007B4728_007D == -2 && _007B4730_007D == Environment.CurrentManagedThreadId)
			{
				_007B4728_007D = 0;
				result = this;
			}
			else
			{
				result = new _003CCutEndOfServiceSpecial_003Ed__50(0)
				{
					_003C_003E4__this = _003C_003E4__this
				};
			}
			return result;
		}

		[DebuggerHidden]
		private IEnumerator _007B4727_007D()
		{
			return ((IEnumerable<UnitInfo>)this).GetEnumerator();
		}

		IEnumerator IEnumerable.GetEnumerator()
		{
			//ILSpy generated this explicit interface implementation from .override directive in {4727}
			return this._007B4727_007D();
		}
	}

	[CompilerGenerated]
	private sealed class _003CFlatten_003Ed__49 : IEnumerable<UnitInfo>, IEnumerable, IEnumerator<UnitInfo>, IEnumerator, IDisposable
	{
		private int _007B4740_007D;

		private UnitInfo _007B4741_007D;

		private int _007B4742_007D;

		private bool _007B4743_007D;

		public bool _003C_003E3__takeSpecial;

		public UnitCollection _003C_003E4__this;

		private IEnumerator<GSILocalEnumerablePair<UnitInfo>> _007B4744_007D;

		private GSILocalEnumerablePair<UnitInfo> _007B4745_007D;

		private int _007B4746_007D;

		private int _007B4747_007D;

		private int _007B4748_007D;

		private IEnumerator<SpecialUnitInstance> _007B4749_007D;

		private SpecialUnitInstance _007B4750_007D;

		UnitInfo IEnumerator<UnitInfo>.Current
		{
			[DebuggerHidden]
			get
			{
				return _007B4741_007D;
			}
		}

		object IEnumerator.Current
		{
			[DebuggerHidden]
			get
			{
				return _007B4741_007D;
			}
		}

		[DebuggerHidden]
		public _003CFlatten_003Ed__49(int _007B4734_007D)
		{
			_007B4740_007D = _007B4734_007D;
			_007B4742_007D = Environment.CurrentManagedThreadId;
		}

		[DebuggerHidden]
		private void _007B4735_007D()
		{
			int num = _007B4740_007D;
			if (num == -3 || num == 2)
			{
				try
				{
				}
				finally
				{
					_007B4737_007D();
				}
			}
			_007B4744_007D = null;
			_007B4745_007D = default(GSILocalEnumerablePair<UnitInfo>);
			_007B4749_007D = null;
			_007B4750_007D = null;
			_007B4740_007D = -2;
		}

		void IDisposable.Dispose()
		{
			//ILSpy generated this explicit interface implementation from .override directive in {4735}
			this._007B4735_007D();
		}

		private bool _007B4736_007D()
		{
			try
			{
				switch (_007B4740_007D)
				{
				default:
					return false;
				case 0:
					_007B4740_007D = -1;
					if (_003C_003E4__this._007B4713_007D == null)
					{
						_003C_003E4__this._007B4713_007D = new Tlist<UnitInfo>(10);
					}
					_003C_003E4__this._007B4713_007D.Clear();
					_007B4744_007D = ((IEnumerable<GSILocalEnumerablePair<UnitInfo>>)_003C_003E4__this._007B4712_007D.UnitInfo/*cast due to .constrained prefix*/).GetEnumerator();
					try
					{
						while (_007B4744_007D.MoveNext())
						{
							_007B4745_007D = _007B4744_007D.Current;
							_007B4746_007D = _007B4745_007D.Count;
							_007B4747_007D = 0;
							while (_007B4747_007D < _007B4746_007D)
							{
								_003C_003E4__this._007B4713_007D.Add(in _007B4745_007D.Info);
								_007B4747_007D++;
							}
							_007B4745_007D = default(GSILocalEnumerablePair<UnitInfo>);
						}
					}
					finally
					{
						if (_007B4744_007D != null)
						{
							_007B4744_007D.Dispose();
						}
					}
					_007B4744_007D = null;
					_003C_003E4__this._007B4713_007D.SortTop((UnitInfo _007B4718_007D) => 0 - _007B4718_007D.Type);
					_007B4748_007D = 0;
					goto IL_01b8;
				case 1:
					_007B4740_007D = -1;
					_007B4748_007D++;
					goto IL_01b8;
				case 2:
					{
						_007B4740_007D = -3;
						_007B4750_007D = null;
						goto IL_023f;
					}
					IL_023f:
					if (_007B4749_007D.MoveNext())
					{
						_007B4750_007D = _007B4749_007D.Current;
						_007B4741_007D = _007B4750_007D.GetInfo;
						_007B4740_007D = 2;
						return true;
					}
					_007B4737_007D();
					_007B4749_007D = null;
					break;
					IL_01b8:
					if (_007B4748_007D < _003C_003E4__this._007B4713_007D.Size)
					{
						_007B4741_007D = _003C_003E4__this._007B4713_007D.Array[_007B4748_007D];
						_007B4740_007D = 1;
						return true;
					}
					if (!_007B4743_007D)
					{
						break;
					}
					_007B4749_007D = ((IEnumerable<SpecialUnitInstance>)_003C_003E4__this._007B4711_007D).GetEnumerator();
					_007B4740_007D = -3;
					goto IL_023f;
				}
				return false;
			}
			catch
			{
				//try-fault
				_007B4735_007D();
				throw;
			}
		}

		bool IEnumerator.MoveNext()
		{
			//ILSpy generated this explicit interface implementation from .override directive in {4736}
			return this._007B4736_007D();
		}

		private void _007B4737_007D()
		{
			_007B4740_007D = -1;
			if (_007B4749_007D != null)
			{
				_007B4749_007D.Dispose();
			}
		}

		[DebuggerHidden]
		private void _007B4738_007D()
		{
			throw new NotSupportedException();
		}

		void IEnumerator.Reset()
		{
			//ILSpy generated this explicit interface implementation from .override directive in {4738}
			this._007B4738_007D();
		}

		[DebuggerHidden]
		IEnumerator<UnitInfo> IEnumerable<UnitInfo>.GetEnumerator()
		{
			_003CFlatten_003Ed__49 _003CFlatten_003Ed__;
			if (_007B4740_007D == -2 && _007B4742_007D == Environment.CurrentManagedThreadId)
			{
				_007B4740_007D = 0;
				_003CFlatten_003Ed__ = this;
			}
			else
			{
				_003CFlatten_003Ed__ = new _003CFlatten_003Ed__49(0)
				{
					_003C_003E4__this = _003C_003E4__this
				};
			}
			_003CFlatten_003Ed__._007B4743_007D = _003C_003E3__takeSpecial;
			return _003CFlatten_003Ed__;
		}

		[DebuggerHidden]
		private IEnumerator _007B4739_007D()
		{
			return ((IEnumerable<UnitInfo>)this).GetEnumerator();
		}

		IEnumerator IEnumerable.GetEnumerator()
		{
			//ILSpy generated this explicit interface implementation from .override directive in {4739}
			return this._007B4739_007D();
		}
	}

	public const int CrewScaler = 4;

	public const float CrewScalerF = 4f;

	public const float RawCrewDamageScaler = 32f;

	public readonly StaticEffectsCalculator Effects;

	public bool HasConflicts;

	private int _007B4705_007D;

	private int _007B4706_007D;

	private int _007B4707_007D;

	private float _007B4708_007D;

	private int _007B4709_007D;

	private int _007B4710_007D;

	private Tlist<SpecialUnitInstance> _007B4711_007D;

	private GSI _007B4712_007D;

	public GSI HurtedCrew;

	private Tlist<UnitInfo> _007B4713_007D;

	public int Count => _007B4705_007D;

	public int CountOfSailors => _007B4706_007D;

	public int CountOfBoardingUnits => _007B4707_007D;

	public int SummaryDamagePerSec => (int)_007B4708_007D;

	public int SummaryHealth => _007B4709_007D;

	public GSI Raw => _007B4712_007D;

	public Tlist<SpecialUnitInstance> Special => _007B4711_007D;

	public int MaxSpecialCrew(PlayerAccount _007B4666_007D)
	{
		return 3 + _007B4666_007D.CaptainSkills[PDynamicAccountBonus.CSpecialCrewLimit] + (_007B4711_007D.Any((SpecialUnitInstance _007B4714_007D) => _007B4714_007D.GetInfo.Bonus.Type == ShipBonusEffect.BSpecialUnitEndConflicts) ? 1 : 0);
	}

	public float Effectivity(ShipDynamicInfo _007B4667_007D)
	{
		float num = WosbCrew.WeaponsReloadingSpeedByCrew(_007B4706_007D, _007B4667_007D.NeedSailors);
		return num + (1f - num) * _007B4667_007D.CrewFineReduce;
	}

	public int SummaryCapacity(Player _007B4668_007D)
	{
		return (int)((float)_007B4710_007D * (1f + _007B4668_007D.UsedShip.BoardingWeightBonus));
	}

	public UnitCollection()
	{
		_007B4712_007D = new GSI();
		HurtedCrew = new GSI();
		_007B4711_007D = new Tlist<SpecialUnitInstance>();
		Effects = new StaticEffectsCalculator();
	}

	protected internal void UpdateInformation()
	{
		_007B4705_007D = 0;
		_007B4706_007D = 0;
		_007B4707_007D = 0;
		_007B4708_007D = 0f;
		_007B4709_007D = 0;
		_007B4710_007D = 0;
		Effects.Clear();
		HasConflicts = false;
		foreach (GSILocalPair item in (IEnumerable<GSILocalPair>)_007B4712_007D)
		{
			UnitInfo unitInfo = Gameplay.UnitsInfo.FromID(item.ID);
			if (unitInfo.Type == UnitType.Sailor)
			{
				_007B4706_007D += item.Count;
			}
			if (unitInfo.Type == UnitType.Boarding)
			{
				_007B4707_007D += item.Count;
			}
			_007B4705_007D += item.Count;
			_007B4708_007D += unitInfo.SampleDamage / (WosbBoarding.UpdateIntervalMs / 1000f) * (float)item.Count;
			_007B4709_007D += unitInfo.Health * item.Count;
			_007B4710_007D += unitInfo.Capacity * item.Count;
			if (!unitInfo.Bonus.IsIdentity)
			{
				Effects.Add(in unitInfo.Bonus, item.Count);
			}
		}
		bool flag = _007B4711_007D.Any((SpecialUnitInstance _007B4715_007D) => _007B4715_007D.GetInfo.Bonus.Type == ShipBonusEffect.BSpecialUnitEndConflicts);
		for (int num = 0; num < _007B4711_007D.Size; num++)
		{
			UnitInfo getInfo = _007B4711_007D.Array[num].GetInfo;
			float num2 = 1f;
			if (!flag && WosbCrew.SpecialUnitsConflicts.TryGetValue(getInfo.SpecialUnitClass, out SpecialUnitClass[] conflicting) && _007B4711_007D.Any((SpecialUnitInstance _007B4719_007D) => conflicting.Contains(_007B4719_007D.GetInfo.SpecialUnitClass)))
			{
				HasConflicts = true;
				num2 = 0.5f;
			}
			Effects.Add(in getInfo.BonusPerBoardingUnit, (float)_007B4707_007D * num2);
			Effects.Add(in getInfo.BonusPerSailor, (float)_007B4706_007D * num2);
			Effects.Add(in getInfo.Bonus, num2);
		}
	}

	public void Add(SpecialUnitInstance _007B4669_007D)
	{
		_007B4711_007D.Add(in _007B4669_007D);
		UpdateInformation();
	}

	private void _007B4670_007D(UnitInfo _007B4671_007D, int _007B4672_007D)
	{
		if (_007B4671_007D.Type == UnitType.Special)
		{
			_007B4711_007D.Add(new SpecialUnitInstance(_007B4671_007D.ID));
			return;
		}
		_007B4712_007D.AddOrRemove(_007B4671_007D.ID, _007B4672_007D);
		HurtedCrew[_007B4671_007D.ID] = Math.Max(0, HurtedCrew[_007B4671_007D.ID] - _007B4672_007D);
	}

	public void Add(UnitInfo _007B4673_007D, int _007B4674_007D, bool _007B4675_007D)
	{
		if (_007B4674_007D < 0)
		{
			throw new ArgumentOutOfRangeException();
		}
		if (_007B4674_007D != 0)
		{
			_007B4670_007D(_007B4673_007D, _007B4674_007D);
			UpdateInformation();
		}
	}

	public int Add(GSI _007B4676_007D, bool _007B4677_007D)
	{
		foreach (GSILocalEnumerablePair<UnitInfo> item in (IEnumerable<GSILocalEnumerablePair<UnitInfo>>)_007B4676_007D.UnitInfo/*cast due to .constrained prefix*/)
		{
			_007B4670_007D(item.Info, item.Count);
		}
		UpdateInformation();
		return _007B4676_007D.GetTotalItemsCount();
	}

	public GSI AddHelper(GSI _007B4678_007D, Player _007B4679_007D)
	{
		if (_007B4678_007D.IsEmpty)
		{
			return _007B4678_007D;
		}
		GSI gSI = new GSI();
		int num = _007B4679_007D.UsedShip.CrewPlaces + _007B4679_007D.UsedShip.ExtraCrewLimit - _007B4679_007D.UsedShip.Crew.Count;
		foreach (GSILocalEnumerablePair<UnitInfo> item in (IEnumerable<GSILocalEnumerablePair<UnitInfo>>)_007B4678_007D.UnitInfo/*cast due to .constrained prefix*/)
		{
			if (item.Info.Type == UnitType.Special)
			{
				_007B4679_007D.AccountConnection.SpecialUnitsInHold[item.Info.ID] += item.Count;
			}
			else if (num > 0)
			{
				gSI[item.Info.ID] += Math.Min(num, item.Count);
				num -= item.Count;
			}
		}
		Add(gSI, _007B4677_007D: false);
		return gSI;
	}

	public bool Remove(UnitInfo _007B4680_007D, int _007B4681_007D)
	{
		if (_007B4680_007D.Type == UnitType.Special)
		{
			if (_007B4681_007D != 1)
			{
				throw new ArgumentException("count != 1");
			}
			if (!_007B4711_007D.Remove((SpecialUnitInstance _007B4720_007D) => _007B4720_007D.ID == _007B4680_007D.ID))
			{
				return false;
			}
		}
		else
		{
			int count = _007B4712_007D.GetCount(_007B4680_007D.ID);
			if (_007B4681_007D > count)
			{
				_007B4712_007D.AddOrRemove(_007B4680_007D.ID, -count);
				UpdateInformation();
				return false;
			}
			_007B4712_007D.AddOrRemove(_007B4680_007D.ID, -_007B4681_007D);
		}
		UpdateInformation();
		return true;
	}

	public void RemoveAll()
	{
		_007B4712_007D.Clean();
		_007B4711_007D.Clear();
		HurtedCrew.Clean();
		UpdateInformation();
	}

	public void RemoveRegularUnits()
	{
		_007B4712_007D.Clean();
		HurtedCrew.Clean();
		UpdateInformation();
	}

	public bool Remove(GSI _007B4682_007D, bool _007B4683_007D, out int _007B4684_007D)
	{
		if (_007B4712_007D.TryRemove(_007B4682_007D))
		{
			_007B4684_007D = _007B4682_007D.GetTotalItemsCount();
			UpdateInformation();
			if (_007B4683_007D)
			{
				GSI _007B5460_007D = _007B4682_007D.RandomCut((float)_007B4682_007D.GetTotalItemsCount() * 0.333f, _007B4712_007D.GetTotalItemsCount());
				HurtedCrew.Add(_007B5460_007D);
				_007B4682_007D.Add(_007B5460_007D);
			}
			return true;
		}
		_007B4684_007D = 0;
		UpdateInformation();
		return false;
	}

	public int GetCount(UnitInfo _007B4685_007D)
	{
		if (_007B4685_007D.Type == UnitType.Special)
		{
			return _007B4711_007D.Count((SpecialUnitInstance _007B4721_007D) => _007B4721_007D.ID == _007B4685_007D.ID);
		}
		return _007B4712_007D.GetCount(_007B4685_007D.ID);
	}

	public GSI PickUnits(int _007B4686_007D, Way _007B4687_007D, GSI _007B4688_007D = null, Func<UnitInfo, bool> _007B4689_007D = null)
	{
		if (_007B4686_007D == 0)
		{
			return null;
		}
		if (_007B4713_007D == null)
		{
			_007B4713_007D = new Tlist<UnitInfo>(10);
		}
		_007B4713_007D.Clear();
		GSI gSI = ((_007B4688_007D == null) ? _007B4712_007D : _007B4712_007D.Clone());
		if (_007B4688_007D != null)
		{
			gSI.Remove(_007B4688_007D);
		}
		foreach (GSILocalEnumerablePair<UnitInfo> item in (IEnumerable<GSILocalEnumerablePair<UnitInfo>>)gSI.UnitInfo/*cast due to .constrained prefix*/)
		{
			GSILocalEnumerablePair<UnitInfo> current = item;
			if (_007B4689_007D == null || _007B4689_007D(current.Info))
			{
				int count = current.Count;
				for (int i = 0; i < count; i++)
				{
					_007B4713_007D.Add(in current.Info);
				}
			}
		}
		switch (_007B4687_007D)
		{
		case Way.PickRandom:
			_007B4713_007D.Shuffle();
			break;
		case Way.PickExpensive:
			_007B4713_007D.SortTop((UnitInfo _007B4716_007D) => _007B4716_007D.InternalPrice);
			break;
		default:
			_007B4713_007D.SortTop((UnitInfo _007B4717_007D) => -_007B4717_007D.InternalPrice);
			break;
		}
		_007B4686_007D = Math.Min(_007B4713_007D.Size, _007B4686_007D);
		if (_007B4686_007D == 0)
		{
			return null;
		}
		GSI gSI2 = new GSI();
		for (int num = 0; num < _007B4686_007D; num++)
		{
			UnitInfo unitInfo = _007B4713_007D.Array[num];
			gSI2.AddOrRemove(unitInfo.ID, 1);
		}
		return gSI2;
	}

	public GSI CreateDestroyCrewFromDamage(float _007B4690_007D, Ship _007B4691_007D)
	{
		if (_007B4712_007D.IsEmpty)
		{
			return null;
		}
		_007B4690_007D *= 32f;
		GSI gSI = _007B4712_007D.Clone();
		float num = _007B4690_007D;
		GSI gSI2 = new GSI();
		float num2 = (float)_007B4709_007D / (float)_007B4705_007D;
		do
		{
			int num3 = gSI.RandomName();
			float num4 = num / num2;
			if (_007B4691_007D != null)
			{
				num4 = ((Gameplay.UnitsInfo.FromID(num3).Type != UnitType.Sailor) ? (num4 * (1f - _007B4691_007D.UsedShip.BoardingCrewProtectionCballs)) : (num4 * (1f - _007B4691_007D.UsedShip.SailingCrewProtectionCballs)));
			}
			int num5 = Rand.Round(num4);
			if (num5 > 0)
			{
				if (Gameplay.UnitsInfo.FromID(num3).Type != UnitType.Special)
				{
					gSI2.AddOrRemove(num3, 1);
				}
				gSI.AddOrRemove(num3, -1);
			}
			num -= num2;
		}
		while (num > 10f && !gSI.IsEmpty);
		if (gSI2.IsEmpty)
		{
			return null;
		}
		bool flag = true;
		int num6 = _007B4705_007D - gSI2.GetTotalItemsCount();
		if (num6 <= 1)
		{
			return null;
		}
		float num7 = 1f - Geometry.Saturate((4f - (float)num6) / 3f);
		if (num7 < 1f)
		{
			gSI2 = gSI2.Clone(num7, RoundMode.Round);
		}
		return gSI2;
	}

	public GSI CreateDestroyCrewByAmount(float _007B4692_007D)
	{
		if (_007B4712_007D.IsEmpty)
		{
			return null;
		}
		GSI gSI = _007B4712_007D.Clone();
		GSI gSI2 = new GSI();
		do
		{
			int num = gSI.RandomName();
			int num2 = Rand.Round(_007B4692_007D);
			if (num2 > 0)
			{
				if (Gameplay.UnitsInfo.FromID(num).Type != UnitType.Special)
				{
					gSI2.AddOrRemove(num, 1);
				}
				gSI.AddOrRemove(num, -1);
			}
			_007B4692_007D -= (float)num2;
		}
		while (_007B4692_007D > 0.5f && !gSI.IsEmpty);
		if (gSI2.IsEmpty)
		{
			return null;
		}
		bool flag = true;
		int num3 = _007B4705_007D - gSI2.GetTotalItemsCount();
		if (num3 <= 1)
		{
			return null;
		}
		float num4 = 1f - Geometry.Saturate((4f - (float)num3) / 3f);
		if (num4 < 1f)
		{
			gSI2 = gSI2.Clone(num4, RoundMode.Round);
		}
		return gSI2;
	}

	public GSI CutRandomExtraUnits(int _007B4693_007D)
	{
		GSI gSI = new GSI();
		int num = Count - _007B4693_007D;
		int num2 = Math.Max(0, Math.Min(num, _007B4706_007D - _007B4693_007D / 2));
		while (num2 > 0)
		{
			foreach (GSILocalEnumerablePair<UnitInfo> item in (IEnumerable<GSILocalEnumerablePair<UnitInfo>>)_007B4712_007D.UnitInfo/*cast due to .constrained prefix*/)
			{
				if (item.Info.Type == UnitType.Sailor)
				{
					int num3 = Math.Min(num2, item.Count);
					num2 -= num3;
					num -= num3;
					gSI[item.Info.ID] += num3;
				}
			}
		}
		while (num > 0)
		{
			foreach (GSILocalEnumerablePair<UnitInfo> item2 in (IEnumerable<GSILocalEnumerablePair<UnitInfo>>)_007B4712_007D.UnitInfo/*cast due to .constrained prefix*/)
			{
				if (item2.Info.Type != UnitType.Sailor)
				{
					int num4 = Math.Min(num, item2.Count);
					num -= num4;
					gSI[item2.Info.ID] += num4;
				}
			}
		}
		_007B4712_007D.Remove(gSI);
		UpdateInformation();
		return gSI;
	}

	[IteratorStateMachine(typeof(_003CFlatten_003Ed__49))]
	internal IEnumerable<UnitInfo> Flatten(bool _007B4694_007D)
	{
		//yield-return decompiler failed: Method not found
		return new _003CFlatten_003Ed__49(-2)
		{
			_003C_003E4__this = this,
			_003C_003E3__takeSpecial = _007B4694_007D
		};
	}

	[IteratorStateMachine(typeof(_003CCutEndOfServiceSpecial_003Ed__50))]
	public IEnumerable<UnitInfo> CutEndOfServiceSpecial()
	{
		//yield-return decompiler failed: Method not found
		return new _003CCutEndOfServiceSpecial_003Ed__50(-2)
		{
			_003C_003E4__this = this
		};
	}

	public int GetSpecialRequiredSalary(PlayerAccount _007B4695_007D, float _007B4696_007D, out bool _007B4697_007D)
	{
		int num = 0;
		foreach (SpecialUnitInstance item in (IEnumerable<SpecialUnitInstance>)_007B4711_007D)
		{
			num += (int)Math.Floor((float)item.PayPerHour(_007B4695_007D.Shipyard.CurrentRealShip.CraftFrom.Rank) * _007B4696_007D / 3600f);
		}
		if (num > 10)
		{
			int num2 = _007B4695_007D.CaptainSkills[PDynamicAccountBonus.PReduceSalaryOfSpecialUnits];
			_007B4697_007D = num2 > 0;
			return (int)((float)num * (1f - (float)num2 / 100f));
		}
		_007B4697_007D = false;
		return 0;
	}

	internal void EvaluteSpecialContractTime(float _007B4698_007D)
	{
		foreach (SpecialUnitInstance item in (IEnumerable<SpecialUnitInstance>)_007B4711_007D)
		{
			item.LeftContractTimeHours = Math.Max(0f, item.LeftContractTimeHours - _007B4698_007D / 3600f);
		}
	}

	public void SpecialSalaryWasDenied(float _007B4699_007D)
	{
		foreach (SpecialUnitInstance item in (IEnumerable<SpecialUnitInstance>)_007B4711_007D)
		{
			item.LeftContractTimeHours = Math.Max(0f, item.LeftContractTimeHours - 4f * _007B4699_007D / 3600f);
		}
	}

	public void RemoveAllSpecialUnits(PlayerAccount _007B4700_007D)
	{
		foreach (SpecialUnitInstance item in (IEnumerable<SpecialUnitInstance>)_007B4711_007D)
		{
			_007B4700_007D.SpecialUnitsAtStorage.Add(item);
		}
		_007B4711_007D.Clear();
		UpdateInformation();
	}

	private void _007B4701_007D(WriterExtern _007B4702_007D)
	{
		_007B4702_007D.WriteNoNull<GSI>(_007B4712_007D);
		_007B4702_007D.WriteByte((byte)251);
		_007B4702_007D.WriteTlistImps(_007B4711_007D);
	}

	private void _007B4703_007D(WriterExtern _007B4704_007D)
	{
		_007B4704_007D.ReadIMPSNoNull<GSI>(ref _007B4712_007D);
		if (_007B4704_007D.PeekByte() == 251)
		{
			_007B4704_007D.ReadByte();
			_007B4704_007D.ReadTlistImps(out _007B4711_007D);
			for (int i = 0; i < _007B4711_007D.Size; i++)
			{
				if (_007B4711_007D.Array[i].ID > Gameplay.UnitsInfo.Size)
				{
					_007B4711_007D.FastRemoveAt(i);
					i--;
				}
			}
		}
		else
		{
			_007B4712_007D = Crew01_2023.Make(_007B4712_007D);
		}
		UpdateInformation();
	}

	public override string ToString()
	{
		StringBuilder stringBuilder = new StringBuilder();
		foreach (GSILocalEnumerablePair<UnitInfo> item in (IEnumerable<GSILocalEnumerablePair<UnitInfo>>)_007B4712_007D.UnitInfo/*cast due to .constrained prefix*/)
		{
			stringBuilder.Append(item.Count + "x" + item.Info.Name + "; ");
		}
		foreach (SpecialUnitInstance item2 in (IEnumerable<SpecialUnitInstance>)_007B4711_007D)
		{
			stringBuilder.Append(item2.GetInfo.Name);
		}
		return stringBuilder.ToString();
	}
}
