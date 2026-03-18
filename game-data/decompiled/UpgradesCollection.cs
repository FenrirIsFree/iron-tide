using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices;
using Common.Resources;
using CommonDataTypes;
using ManualPacketSerialization;
using ManualPacketSerialization.Externs;
using TheraEngine.Collections;

namespace Common.Game;

public class UpgradesCollection : IMPSerializable
{
	[StructLayout(LayoutKind.Sequential, Size = 1)]
	private struct Filler : IMPSerializable
	{
		private void _007B4797_007D(WriterExtern _007B4798_007D)
		{
		}

		private void _007B4799_007D(WriterExtern _007B4800_007D)
		{
			byte b = _007B4800_007D.ReadByte();
			float num = default(float);
			_007B4800_007D.ReadStruct<float>(ref num);
			byte b2 = _007B4800_007D.ReadByte();
			if (_007B4800_007D.PeekByte() == 253)
			{
				_007B4800_007D.ReadByte();
				ushort num2 = default(ushort);
				_007B4800_007D.ReadStruct<ushort>(ref num2);
			}
		}
	}

	[CompilerGenerated]
	private sealed class _003CEnumerateInstalledUps_003Ed__21 : IEnumerable<ShipUpgradeInfo>, IEnumerable, IEnumerator<ShipUpgradeInfo>, IEnumerator, IDisposable
	{
		private int _007B4816_007D;

		private ShipUpgradeInfo _007B4817_007D;

		private int _007B4818_007D;

		public UpgradesCollection _003C_003E4__this;

		private IEnumerator<ShipUpgradeInstance> _007B4819_007D;

		private ShipUpgradeInstance _007B4820_007D;

		ShipUpgradeInfo IEnumerator<ShipUpgradeInfo>.Current
		{
			[DebuggerHidden]
			get
			{
				return _007B4817_007D;
			}
		}

		object IEnumerator.Current
		{
			[DebuggerHidden]
			get
			{
				return _007B4817_007D;
			}
		}

		[DebuggerHidden]
		public _003CEnumerateInstalledUps_003Ed__21(int _007B4810_007D)
		{
			_007B4816_007D = _007B4810_007D;
			_007B4818_007D = Environment.CurrentManagedThreadId;
		}

		[DebuggerHidden]
		private void _007B4811_007D()
		{
			int num = _007B4816_007D;
			if (num == -3 || num == 1)
			{
				try
				{
				}
				finally
				{
					_007B4813_007D();
				}
			}
			_007B4819_007D = null;
			_007B4816_007D = -2;
		}

		void IDisposable.Dispose()
		{
			//ILSpy generated this explicit interface implementation from .override directive in {4811}
			this._007B4811_007D();
		}

		private bool _007B4812_007D()
		{
			try
			{
				switch (_007B4816_007D)
				{
				default:
					return false;
				case 0:
					_007B4816_007D = -1;
					_007B4819_007D = ((IEnumerable<ShipUpgradeInstance>)_003C_003E4__this._007B4795_007D).GetEnumerator();
					_007B4816_007D = -3;
					break;
				case 1:
					_007B4816_007D = -3;
					break;
				}
				while (_007B4819_007D.MoveNext())
				{
					_007B4820_007D = _007B4819_007D.Current;
					if (!_007B4820_007D.IsNull)
					{
						_007B4817_007D = _007B4820_007D.Info;
						_007B4816_007D = 1;
						return true;
					}
				}
				_007B4813_007D();
				_007B4819_007D = null;
				return false;
			}
			catch
			{
				//try-fault
				_007B4811_007D();
				throw;
			}
		}

		bool IEnumerator.MoveNext()
		{
			//ILSpy generated this explicit interface implementation from .override directive in {4812}
			return this._007B4812_007D();
		}

		private void _007B4813_007D()
		{
			_007B4816_007D = -1;
			if (_007B4819_007D != null)
			{
				_007B4819_007D.Dispose();
			}
		}

		[DebuggerHidden]
		private void _007B4814_007D()
		{
			throw new NotSupportedException();
		}

		void IEnumerator.Reset()
		{
			//ILSpy generated this explicit interface implementation from .override directive in {4814}
			this._007B4814_007D();
		}

		[DebuggerHidden]
		IEnumerator<ShipUpgradeInfo> IEnumerable<ShipUpgradeInfo>.GetEnumerator()
		{
			_003CEnumerateInstalledUps_003Ed__21 result;
			if (_007B4816_007D == -2 && _007B4818_007D == Environment.CurrentManagedThreadId)
			{
				_007B4816_007D = 0;
				result = this;
			}
			else
			{
				result = new _003CEnumerateInstalledUps_003Ed__21(0)
				{
					_003C_003E4__this = _003C_003E4__this
				};
			}
			return result;
		}

		[DebuggerHidden]
		private IEnumerator _007B4815_007D()
		{
			return ((IEnumerable<ShipUpgradeInfo>)this).GetEnumerator();
		}

		IEnumerator IEnumerable.GetEnumerator()
		{
			//ILSpy generated this explicit interface implementation from .override directive in {4815}
			return this._007B4815_007D();
		}
	}

	[CompilerGenerated]
	private sealed class _003CGetUpgrades_003Ed__16 : IEnumerable<InstalledShipUpgradeSlot>, IEnumerable, IEnumerator<InstalledShipUpgradeSlot>, IEnumerator, IDisposable
	{
		private int _007B4827_007D;

		private InstalledShipUpgradeSlot _007B4828_007D;

		private int _007B4829_007D;

		public UpgradesCollection _003C_003E4__this;

		private int _007B4830_007D;

		InstalledShipUpgradeSlot IEnumerator<InstalledShipUpgradeSlot>.Current
		{
			[DebuggerHidden]
			get
			{
				return _007B4828_007D;
			}
		}

		object IEnumerator.Current
		{
			[DebuggerHidden]
			get
			{
				return _007B4828_007D;
			}
		}

		[DebuggerHidden]
		public _003CGetUpgrades_003Ed__16(int _007B4822_007D)
		{
			_007B4827_007D = _007B4822_007D;
			_007B4829_007D = Environment.CurrentManagedThreadId;
		}

		[DebuggerHidden]
		private void _007B4823_007D()
		{
			_007B4827_007D = -2;
		}

		void IDisposable.Dispose()
		{
			//ILSpy generated this explicit interface implementation from .override directive in {4823}
			this._007B4823_007D();
		}

		private bool _007B4824_007D()
		{
			int num = _007B4827_007D;
			if (num != 0)
			{
				if (num != 1)
				{
					return false;
				}
				_007B4827_007D = -1;
				goto IL_008d;
			}
			_007B4827_007D = -1;
			_007B4830_007D = 0;
			goto IL_009e;
			IL_008d:
			_007B4830_007D++;
			goto IL_009e;
			IL_009e:
			if (_007B4830_007D < _003C_003E4__this._007B4795_007D.Size)
			{
				if (!_003C_003E4__this._007B4795_007D.Array[_007B4830_007D].IsNull)
				{
					_007B4828_007D = new InstalledShipUpgradeSlot(_007B4830_007D, _003C_003E4__this._007B4795_007D.Array[_007B4830_007D]);
					_007B4827_007D = 1;
					return true;
				}
				goto IL_008d;
			}
			return false;
		}

		bool IEnumerator.MoveNext()
		{
			//ILSpy generated this explicit interface implementation from .override directive in {4824}
			return this._007B4824_007D();
		}

		[DebuggerHidden]
		private void _007B4825_007D()
		{
			throw new NotSupportedException();
		}

		void IEnumerator.Reset()
		{
			//ILSpy generated this explicit interface implementation from .override directive in {4825}
			this._007B4825_007D();
		}

		[DebuggerHidden]
		IEnumerator<InstalledShipUpgradeSlot> IEnumerable<InstalledShipUpgradeSlot>.GetEnumerator()
		{
			_003CGetUpgrades_003Ed__16 result;
			if (_007B4827_007D == -2 && _007B4829_007D == Environment.CurrentManagedThreadId)
			{
				_007B4827_007D = 0;
				result = this;
			}
			else
			{
				result = new _003CGetUpgrades_003Ed__16(0)
				{
					_003C_003E4__this = _003C_003E4__this
				};
			}
			return result;
		}

		[DebuggerHidden]
		private IEnumerator _007B4826_007D()
		{
			return ((IEnumerable<InstalledShipUpgradeSlot>)this).GetEnumerator();
		}

		IEnumerator IEnumerable.GetEnumerator()
		{
			//ILSpy generated this explicit interface implementation from .override directive in {4826}
			return this._007B4826_007D();
		}
	}

	[CompilerGenerated]
	private sealed class _003CGetUpgrades_003Ed__17 : IEnumerable<InstalledShipUpgradeSlot>, IEnumerable, IEnumerator<InstalledShipUpgradeSlot>, IEnumerator, IDisposable
	{
		private int _007B4837_007D;

		private InstalledShipUpgradeSlot _007B4838_007D;

		private int _007B4839_007D;

		private PlayerShipDynamicInfo _007B4840_007D;

		public PlayerShipDynamicInfo _003C_003E3__info;

		public UpgradesCollection _003C_003E4__this;

		private int _007B4841_007D;

		private int _007B4842_007D;

		InstalledShipUpgradeSlot IEnumerator<InstalledShipUpgradeSlot>.Current
		{
			[DebuggerHidden]
			get
			{
				return _007B4838_007D;
			}
		}

		object IEnumerator.Current
		{
			[DebuggerHidden]
			get
			{
				return _007B4838_007D;
			}
		}

		[DebuggerHidden]
		public _003CGetUpgrades_003Ed__17(int _007B4832_007D)
		{
			_007B4837_007D = _007B4832_007D;
			_007B4839_007D = Environment.CurrentManagedThreadId;
		}

		[DebuggerHidden]
		private void _007B4833_007D()
		{
			_007B4837_007D = -2;
		}

		void IDisposable.Dispose()
		{
			//ILSpy generated this explicit interface implementation from .override directive in {4833}
			this._007B4833_007D();
		}

		private bool _007B4834_007D()
		{
			switch (_007B4837_007D)
			{
			default:
				return false;
			case 0:
				_007B4837_007D = -1;
				_007B4841_007D = _007B4840_007D.MaxUpgradesCount;
				_007B4842_007D = 0;
				break;
			case 1:
				_007B4837_007D = -1;
				goto IL_00d0;
			case 2:
				{
					_007B4837_007D = -1;
					goto IL_00d0;
				}
				IL_00d0:
				_007B4842_007D++;
				break;
			}
			if (_007B4842_007D < _007B4841_007D)
			{
				if (_007B4842_007D < _003C_003E4__this._007B4795_007D.Size)
				{
					_007B4838_007D = new InstalledShipUpgradeSlot(_007B4842_007D, _003C_003E4__this._007B4795_007D.Array[_007B4842_007D]);
					_007B4837_007D = 1;
					return true;
				}
				_007B4838_007D = new InstalledShipUpgradeSlot(_007B4842_007D, default(ShipUpgradeInstance));
				_007B4837_007D = 2;
				return true;
			}
			return false;
		}

		bool IEnumerator.MoveNext()
		{
			//ILSpy generated this explicit interface implementation from .override directive in {4834}
			return this._007B4834_007D();
		}

		[DebuggerHidden]
		private void _007B4835_007D()
		{
			throw new NotSupportedException();
		}

		void IEnumerator.Reset()
		{
			//ILSpy generated this explicit interface implementation from .override directive in {4835}
			this._007B4835_007D();
		}

		[DebuggerHidden]
		IEnumerator<InstalledShipUpgradeSlot> IEnumerable<InstalledShipUpgradeSlot>.GetEnumerator()
		{
			_003CGetUpgrades_003Ed__17 _003CGetUpgrades_003Ed__;
			if (_007B4837_007D == -2 && _007B4839_007D == Environment.CurrentManagedThreadId)
			{
				_007B4837_007D = 0;
				_003CGetUpgrades_003Ed__ = this;
			}
			else
			{
				_003CGetUpgrades_003Ed__ = new _003CGetUpgrades_003Ed__17(0)
				{
					_003C_003E4__this = _003C_003E4__this
				};
			}
			_003CGetUpgrades_003Ed__._007B4840_007D = _003C_003E3__info;
			return _003CGetUpgrades_003Ed__;
		}

		[DebuggerHidden]
		private IEnumerator _007B4836_007D()
		{
			return ((IEnumerable<InstalledShipUpgradeSlot>)this).GetEnumerator();
		}

		IEnumerator IEnumerable.GetEnumerator()
		{
			//ILSpy generated this explicit interface implementation from .override directive in {4836}
			return this._007B4836_007D();
		}
	}

	public const int MaxSameEffects = 2;

	public const int InitUpgradesCount = 6;

	public readonly StaticEffectsCalculator Effects = new StaticEffectsCalculator();

	private Tlist<ShipUpgradeInstance> _007B4795_007D;

	private readonly ShipBonus[] _007B4796_007D = new ShipBonus[3]
	{
		new ShipBonus(ShipBonusEffect.PHealth, -5f),
		new ShipBonus(ShipBonusEffect.PMobilityBonus, -5f),
		new ShipBonus(ShipBonusEffect.PCapacity, -5f)
	};

	public int InstalledCount => _007B4795_007D.Count((ShipUpgradeInstance _007B4801_007D) => !_007B4801_007D.IsNull);

	public int MortarUpgradesCount => _007B4795_007D.Count((ShipUpgradeInstance _007B4802_007D) => !_007B4802_007D.IsNull && _007B4802_007D.Info.IsMortarUpgrade);

	public ShipUpgradeInfo HavingModification => _007B4795_007D.FirstOrDefault((ShipUpgradeInstance _007B4803_007D) => _007B4803_007D.Info != null && _007B4803_007D.Info.CategoryUi == ShipUpgradeCategory.Modification).Info;

	public UpgradesCollection()
	{
		_007B4795_007D = new Tlist<ShipUpgradeInstance>(6);
	}

	public void InstallUpgrade(PlayerShipDynamicInfo _007B4766_007D, ShipUpgradeInfo _007B4767_007D, int _007B4768_007D)
	{
		while (_007B4795_007D.Size < _007B4768_007D + 1)
		{
			_007B4795_007D.Add(default(ShipUpgradeInstance));
		}
		if (!_007B4795_007D.Array[_007B4768_007D].IsNull)
		{
			throw new InvalidOperationException("Already installed");
		}
		_007B4795_007D.Array[_007B4768_007D] = new ShipUpgradeInstance(_007B4767_007D);
		UpdateInformation(_007B4766_007D.CraftFrom);
	}

	public void InstallStoredUpgrade(PlayerShipDynamicInfo _007B4769_007D, in ShipUpgradeInstance _007B4770_007D, int _007B4771_007D)
	{
		InstallUpgrade(_007B4769_007D, _007B4770_007D.Info, _007B4771_007D);
		_007B4795_007D.Array[_007B4771_007D].Strength = Math.Min(_007B4770_007D.Strength, _007B4770_007D.Info.WearAmount.Value);
		UpdateInformation(_007B4769_007D.CraftFrom);
	}

	public void RestoreStrength(PlayerShipDynamicInfo _007B4772_007D, int _007B4773_007D)
	{
		if (_007B4795_007D.Array[_007B4773_007D].IsNull || _007B4773_007D >= _007B4795_007D.Size)
		{
			throw new InvalidOperationException("There is no upgrade");
		}
		_007B4795_007D.Array[_007B4773_007D].Strength = _007B4795_007D.Array[_007B4773_007D].Info.WearAmount.Value;
		UpdateInformation(_007B4772_007D.CraftFrom);
	}

	public ShipUpgradeInstance TakeOffUpgrade(PlayerShipDynamicInfo _007B4774_007D, int _007B4775_007D)
	{
		if (_007B4795_007D.Array[_007B4775_007D].IsNull || _007B4775_007D >= _007B4795_007D.Size)
		{
			throw new InvalidOperationException("There is no upgrade");
		}
		ShipUpgradeInstance result = new ShipUpgradeInstance(_007B4795_007D.Array[_007B4775_007D].ID, _007B4795_007D.Array[_007B4775_007D].Strength);
		_007B4795_007D.Array[_007B4775_007D].ID = 0;
		UpdateInformation(_007B4774_007D.CraftFrom);
		return result;
	}

	public void OrderSlots()
	{
		_007B4795_007D.SortTop((ShipUpgradeInstance _007B4804_007D) => (!_007B4804_007D.IsNull) ? 1 : 0);
	}

	[IteratorStateMachine(typeof(_003CGetUpgrades_003Ed__16))]
	public IEnumerable<InstalledShipUpgradeSlot> GetUpgrades()
	{
		//yield-return decompiler failed: Method not found
		return new _003CGetUpgrades_003Ed__16(-2)
		{
			_003C_003E4__this = this
		};
	}

	[IteratorStateMachine(typeof(_003CGetUpgrades_003Ed__17))]
	public IEnumerable<InstalledShipUpgradeSlot> GetUpgrades(PlayerShipDynamicInfo _007B4776_007D)
	{
		//yield-return decompiler failed: Method not found
		return new _003CGetUpgrades_003Ed__17(-2)
		{
			_003C_003E4__this = this,
			_003C_003E3__info = _007B4776_007D
		};
	}

	public InstalledShipUpgradeSlot GetSlot(int _007B4777_007D)
	{
		if (_007B4777_007D >= _007B4795_007D.Size)
		{
			return new InstalledShipUpgradeSlot(_007B4777_007D, default(ShipUpgradeInstance));
		}
		return new InstalledShipUpgradeSlot(_007B4777_007D, _007B4795_007D.Array[_007B4777_007D]);
	}

	public int GetQuantityOfEffect(ShipBonusEffect _007B4778_007D, bool _007B4779_007D)
	{
		int num = 0;
		foreach (ShipUpgradeInstance item in (IEnumerable<ShipUpgradeInstance>)_007B4795_007D)
		{
			if (item.IsNull || (_007B4779_007D && item.Info.CategoryUi == ShipUpgradeCategory.Sailes))
			{
				continue;
			}
			foreach (ShipBonus effect in item.Info.GetEffects(null))
			{
				if (effect.Type == _007B4778_007D && effect.Value > 0f)
				{
					num++;
				}
			}
		}
		return num;
	}

	public bool HasInstalledUpgradeByID(int _007B4780_007D)
	{
		for (int i = 0; i < _007B4795_007D.Size; i++)
		{
			if (_007B4795_007D.Array[i].ID == _007B4780_007D)
			{
				return true;
			}
		}
		return false;
	}

	[IteratorStateMachine(typeof(_003CEnumerateInstalledUps_003Ed__21))]
	public IEnumerable<ShipUpgradeInfo> EnumerateInstalledUps()
	{
		//yield-return decompiler failed: Method not found
		return new _003CEnumerateInstalledUps_003Ed__21(-2)
		{
			_003C_003E4__this = this
		};
	}

	public ShipUpgradeInfo GetUpgradeByEffect(ShipBonusEffect _007B4781_007D)
	{
		foreach (ShipUpgradeInstance item in (IEnumerable<ShipUpgradeInstance>)_007B4795_007D)
		{
			if (!item.IsNull && item.Info.GetEffects(null).Count((ShipBonus _007B4808_007D) => _007B4808_007D.Type == _007B4781_007D) > 0)
			{
				return item.Info;
			}
		}
		return null;
	}

	[MethodImpl(MethodImplOptions.AggressiveInlining)]
	internal float CurrentExtraUpgradeFine(ShipBonusEffect _007B4782_007D, PlayerShipDynamicInfo _007B4783_007D)
	{
		for (int i = 0; i < _007B4796_007D.Length; i++)
		{
			if (_007B4796_007D[i].Type == _007B4782_007D && CurrentExtraUpgradeFine(_007B4783_007D).Length != 0)
			{
				return _007B4796_007D[i].Value / 100f;
			}
		}
		return 0f;
	}

	public ShipBonus[] CurrentExtraUpgradeFine(PlayerShipDynamicInfo _007B4784_007D)
	{
		int num = _007B4784_007D.MaxUpgradesCount - 1;
		if (num < _007B4795_007D.Size && !_007B4795_007D[num].IsNull)
		{
			return _007B4796_007D;
		}
		return Array.Empty<ShipBonus>();
	}

	internal void UpdateInformation(PlayerShipInfo _007B4785_007D)
	{
		Effects.Clear();
		for (int i = 0; i < _007B4795_007D.Size; i++)
		{
			ShipUpgradeInstance shipUpgradeInstance = _007B4795_007D.Array[i];
			if (shipUpgradeInstance.ID == 0 || (!(shipUpgradeInstance.Strength > 0f) && shipUpgradeInstance.Info.WearType != UpgradeStrengthWear.None))
			{
				continue;
			}
			foreach (ShipBonus effect in shipUpgradeInstance.Info.GetEffects(_007B4785_007D))
			{
				ShipBonus _007B5225_007D = effect;
				Effects.Add(in _007B5225_007D);
			}
			if (shipUpgradeInstance.Info.CategoryUi == ShipUpgradeCategory.Modification)
			{
				Effects.Add(ShipBonusEffect.MExtraUpgradePlaces, 1f);
			}
		}
	}

	internal void EvaluteStrength(ShipDynamicInfo _007B4786_007D, UpgradeStrengthWear _007B4787_007D, float _007B4788_007D, Player _007B4789_007D)
	{
		for (int i = 0; i < _007B4795_007D.Size; i++)
		{
			if (!_007B4795_007D.Array[i].IsNull && _007B4795_007D.Array[i].Info.WearType == _007B4787_007D)
			{
				if (_007B4795_007D.Array[i].Info.HasEffect(ShipBonusEffect.PDamageCannonIfStrengthBelow30P) && _007B4786_007D.DamageUpIfStrengthBefore30pNow == 0f)
				{
					_007B4788_007D = 0f;
				}
				if (_007B4789_007D.EnableUpgradeWear)
				{
					_007B4795_007D.Array[i].Strength = Math.Max(0f, _007B4795_007D.Array[i].Strength - _007B4788_007D);
				}
			}
		}
	}

	private void _007B4790_007D(WriterExtern _007B4791_007D)
	{
		_007B4791_007D.WriteTlistStruct<ShipUpgradeInstance>(_007B4795_007D);
		_007B4791_007D.WriteTlistStruct<ShipUpgradeInstance>(Tlist<ShipUpgradeInstance>.EmptyReadonly);
	}

	private void _007B4792_007D(WriterExtern _007B4793_007D)
	{
		_007B4793_007D.ReadTlistStruct<ShipUpgradeInstance>(out _007B4795_007D);
		_007B4793_007D.ReadTlistStruct<Filler>(out Tlist<Filler> _);
		for (int i = 0; i < _007B4795_007D.Size && _007B4795_007D.Array[_007B4795_007D.Size - i - 1].IsNull; i++)
		{
			_007B4795_007D.Size--;
		}
		int num = _007B4795_007D.FindIndex((ShipUpgradeInstance _007B4805_007D) => !_007B4805_007D.IsNull && _007B4805_007D.Info.CategoryUi == ShipUpgradeCategory.Sailes);
		if (num >= 1)
		{
			ShipUpgradeInstance item = _007B4795_007D[num];
			ShipUpgradeInstance[] array = _007B4795_007D.Where((ShipUpgradeInstance _007B4806_007D) => !_007B4806_007D.IsNull && _007B4806_007D.Info.CategoryUi != ShipUpgradeCategory.Sailes).ToArray();
			_007B4795_007D.Clear();
			_007B4795_007D.Add(in item);
			ShipUpgradeInstance[] array2 = array;
			for (int num2 = 0; num2 < array2.Length; num2++)
			{
				ShipUpgradeInstance item2 = array2[num2];
				_007B4795_007D.Add(in item2);
			}
		}
	}

	internal void SerializerInitialize(PlayerShipInfo _007B4794_007D)
	{
		for (int i = 0; i < _007B4795_007D.Size; i++)
		{
			if (!_007B4795_007D.Array[i].IsNull && !_007B4795_007D.Array[i].Info.IsUpgradeAvailableIn(_007B4794_007D, _007B4795_007D.Any((ShipUpgradeInstance _007B4807_007D) => !_007B4807_007D.IsNull && _007B4807_007D.Info.HasEffect(ShipBonusEffect.BExtraMortars))))
			{
				_007B4795_007D.Array[i].ID = 0;
			}
		}
		UpdateInformation(_007B4794_007D);
	}
}
