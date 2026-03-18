using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using System.Runtime.CompilerServices;
using Common.Account;
using Common.Data;
using Common.Game;
using CommonDataTypes;
using Microsoft.Xna.Framework;
using TheraEngine.Collections;
using TheraEngine.PacketValues;

namespace Common.Resources;

public class PlayerShipDynamicInfo : ShipDynamicInfo
{
	[CompilerGenerated]
	private sealed class _003CRemoveDesignElementsByCategory_003Ed__76 : IEnumerable<ShipDesignInfo>, IEnumerable, IEnumerator<ShipDesignInfo>, IEnumerator, IDisposable
	{
		private int _007B2771_007D;

		private ShipDesignInfo _007B2772_007D;

		private int _007B2773_007D;

		private Func<ShipDesignCategory, bool> _007B2774_007D;

		public Func<ShipDesignCategory, bool> _003C_003E3__check;

		public PlayerShipDynamicInfo _003C_003E4__this;

		private bool _007B2775_007D;

		private int _007B2776_007D;

		private ShipDesignInfo _007B2777_007D;

		ShipDesignInfo IEnumerator<ShipDesignInfo>.Current
		{
			[DebuggerHidden]
			get
			{
				return _007B2772_007D;
			}
		}

		object IEnumerator.Current
		{
			[DebuggerHidden]
			get
			{
				return _007B2772_007D;
			}
		}

		[DebuggerHidden]
		public _003CRemoveDesignElementsByCategory_003Ed__76(int _007B2766_007D)
		{
			_007B2771_007D = _007B2766_007D;
			_007B2773_007D = Environment.CurrentManagedThreadId;
		}

		[DebuggerHidden]
		private void _007B2767_007D()
		{
			_007B2777_007D = null;
			_007B2771_007D = -2;
		}

		void IDisposable.Dispose()
		{
			//ILSpy generated this explicit interface implementation from .override directive in {2767}
			this._007B2767_007D();
		}

		private bool _007B2768_007D()
		{
			int num = _007B2771_007D;
			if (num != 0)
			{
				if (num != 1)
				{
					return false;
				}
				_007B2771_007D = -1;
				_003C_003E4__this.designEmenents[_007B2776_007D] = null;
				_007B2775_007D = true;
				goto IL_00b2;
			}
			_007B2771_007D = -1;
			_007B2775_007D = false;
			_007B2776_007D = 0;
			goto IL_00ca;
			IL_00b2:
			_007B2777_007D = null;
			_007B2776_007D++;
			goto IL_00ca;
			IL_00ca:
			if (_007B2776_007D < DesignElementsCount)
			{
				_007B2777_007D = _003C_003E4__this.designEmenents[_007B2776_007D];
				if (_007B2777_007D != null && _007B2774_007D(_007B2777_007D.Category))
				{
					_007B2772_007D = _007B2777_007D;
					_007B2771_007D = 1;
					return true;
				}
				goto IL_00b2;
			}
			if (_007B2775_007D)
			{
				_003C_003E4__this.UpdateDesingElementsBonuses();
			}
			return false;
		}

		bool IEnumerator.MoveNext()
		{
			//ILSpy generated this explicit interface implementation from .override directive in {2768}
			return this._007B2768_007D();
		}

		[DebuggerHidden]
		private void _007B2769_007D()
		{
			throw new NotSupportedException();
		}

		void IEnumerator.Reset()
		{
			//ILSpy generated this explicit interface implementation from .override directive in {2769}
			this._007B2769_007D();
		}

		[DebuggerHidden]
		IEnumerator<ShipDesignInfo> IEnumerable<ShipDesignInfo>.GetEnumerator()
		{
			_003CRemoveDesignElementsByCategory_003Ed__76 _003CRemoveDesignElementsByCategory_003Ed__;
			if (_007B2771_007D == -2 && _007B2773_007D == Environment.CurrentManagedThreadId)
			{
				_007B2771_007D = 0;
				_003CRemoveDesignElementsByCategory_003Ed__ = this;
			}
			else
			{
				_003CRemoveDesignElementsByCategory_003Ed__ = new _003CRemoveDesignElementsByCategory_003Ed__76(0)
				{
					_003C_003E4__this = _003C_003E4__this
				};
			}
			_003CRemoveDesignElementsByCategory_003Ed__._007B2774_007D = _003C_003E3__check;
			return _003CRemoveDesignElementsByCategory_003Ed__;
		}

		[DebuggerHidden]
		private IEnumerator _007B2770_007D()
		{
			return ((IEnumerable<ShipDesignInfo>)this).GetEnumerator();
		}

		IEnumerator IEnumerable.GetEnumerator()
		{
			//ILSpy generated this explicit interface implementation from .override directive in {2770}
			return this._007B2770_007D();
		}
	}

	public static readonly int DesignElementsCount = Enum.GetValues(typeof(ShipDesignCategory)).Length;

	public Vector2 BigLampPosition;

	public Vector3 BowFigurePosition;

	public Bits32 Decal1SelectedSailesBits;

	public Bits32 Decal2SelectedSailesBits;

	public string CustomName;

	protected GSI ballsOfHold;

	public GSI PrivateResourcesOfHold;

	protected GSI powderKegsOfHold;

	internal SlottedMap<ShipDesignInfo> designEmenents;

	private StaticEffectsCalculator _007B2758_007D;

	internal float internalFoodBonus;

	public GSI CannonsShouldMoveToStorage;

	public PlayerShipInfo CraftFrom;

	[CompilerGenerated]
	[DebuggerBrowsable(DebuggerBrowsableState.Never)]
	private int _007B2759_007D = 1;

	public UpgradesCollection Upgrades;

	public PowerupItemsSlots PowerupItemSlots;

	public float ClientTimeToRestoreIntegrity = 0f;

	[CompilerGenerated]
	[DebuggerBrowsable(DebuggerBrowsableState.Never)]
	private float _007B2760_007D;

	public bool TrophyShipNotification;

	public float DesignBowFigureScale => (BowFigurePosition.Z == 0f) ? 1f : BowFigurePosition.Z;

	public string ShipNameVisible => string.IsNullOrEmpty(CustomName) ? CraftFrom.ShipName : CustomName;

	public int Integrity
	{
		[CompilerGenerated]
		get
		{
			return _007B2759_007D;
		}
		[CompilerGenerated]
		internal set
		{
			_007B2759_007D = value;
		}
	}

	public bool IntegrityIsDestroyed => Integrity == 0 && CraftFrom.MaxIntegrity != -1;

	public virtual GSI BallsOfHold => ballsOfHold;

	public GSI PowderKegsOfHold => powderKegsOfHold;

	public override float MaxHp => base.MaxHp * (IntegrityIsDestroyed ? 0.5f : 1f);

	protected override float BasicHp => CraftFrom.PatHealth * (1f - AllStatFine);

	protected override float BasicCapacity => CraftFrom.PatCapacity * (1f - AllStatFine);

	protected override float BasicArmor => CraftFrom.PatArmor * (1f - AllStatFine);

	internal override float BasicSpeed => CraftFrom.PatSpeed * (1f - AllStatFine);

	protected override int BasicCrewPlaces => (int)((float)CraftFrom.PatPlacesUnits * (1f - AllStatFine));

	protected override float BasicMobility => CraftFrom.PatMobility * (1f - AllStatFine);

	public float FreeCapacity => Math.Max(0f, base.Capacity - GetItemsMass());

	public virtual bool IsRemoteOrSlim => false;

	public bool AllowAnyMending => firstHP.Summary < MaxHp || !base.IsSailesFull;

	public int MaxUpgradesCount => (int)GetBonus(ShipBonusEffect.MExtraUpgradePlaces, _007B2720_007D: false) + 6 + CraftFrom.ExtraPlacesForUpgrades;

	public override float PlayerXpAndRewardBonus => base.PlayerXpAndRewardBonus;

	public float PlayerXpAndRewardBonusBattle => base.PlayerXpAndRewardBonus + CraftFrom.BattleFarmingBonus;

	public bool AvanpostMode => GetBonus(ShipBonusEffect.BAvanpostMode) > 0f;

	public bool CanGoOnly1Speed => GetBonus(ShipBonusEffect.BCanGoOnly1Speed) > 0f;

	public bool CanGoOnly2Speed => GetBonus(ShipBonusEffect.BCanGoOnly2Speed) > 0f;

	public float AllStatFine
	{
		[CompilerGenerated]
		get
		{
			return _007B2760_007D;
		}
		[CompilerGenerated]
		internal set
		{
			_007B2760_007D = value;
		}
	}

	protected override float GetBonus(ShipBonusEffect _007B2719_007D, bool _007B2720_007D = true)
	{
		float num = 0f;
		if (_007B2720_007D)
		{
			if (DynamicBonus != null)
			{
				num += DynamicBonus.Stats[_007B2719_007D];
			}
			if (internalFoodBonus > 0f)
			{
				num += WosbCrew.BonusesForSatietyLookup[_007B2719_007D] * internalFoodBonus;
			}
		}
		if (_007B2719_007D == ShipBonusEffect.PPowerupItemsReload || _007B2719_007D == ShipBonusEffect.PFalkonetReloadBoost || _007B2719_007D == ShipBonusEffect.PMortarReload || _007B2719_007D == ShipBonusEffect.PBoardingHookReload)
		{
			return GetBonusMultiplying(_007B2719_007D, num);
		}
		return Upgrades.Effects[_007B2719_007D] + Upgrades.CurrentExtraUpgradeFine(_007B2719_007D, this) + _007B2758_007D[_007B2719_007D] + Crew.Effects[_007B2719_007D] + PowerupItemSlots.EffectsFromInstalled[_007B2719_007D] + num;
	}

	internal float GetBonusMultiplying(ShipBonusEffect _007B2721_007D, float _007B2722_007D = 0f)
	{
		float num = Upgrades.Effects[_007B2721_007D] + Upgrades.CurrentExtraUpgradeFine(_007B2721_007D, this);
		float num2 = _007B2758_007D[_007B2721_007D];
		float num3 = Crew.Effects[_007B2721_007D];
		return 1f - (1f - num) * (1f - num2) * (1f - num3) * (1f - _007B2722_007D);
	}

	protected PlayerShipDynamicInfo(PlayerShipInfo _007B2725_007D)
		: base(_007B2725_007D.StaticInfo)
	{
		CraftFrom = _007B2725_007D;
		_007B2758_007D = new StaticEffectsCalculator();
		Decal1SelectedSailesBits.Value = int.MaxValue;
		Decal2SelectedSailesBits.Value = _007B2725_007D.StaticInfo.AnimatedSailesBits.Value;
		PowerupItemSlots = new PowerupItemsSlots();
	}

	public static PlayerShipDynamicInfo CreateNewFromShipInfo(PlayerShipInfo _007B2726_007D, bool _007B2727_007D = false)
	{
		PlayerShipDynamicInfo playerShipDynamicInfo = new PlayerShipDynamicInfo(_007B2726_007D);
		playerShipDynamicInfo.Mortars = new Map<CannonGameInstance>();
		if (_007B2727_007D)
		{
			playerShipDynamicInfo.Cannons = new CannonCollection();
			playerShipDynamicInfo.Cannons.SetupAll(_007B2726_007D.StaticInfo, Gameplay.CannonsGameInfo.First((CannonGameInfo _007B2761_007D) => _007B2761_007D.Class == CannonClass.DistanceCannon), CannonFeature.Firegun);
			CannonLocationInfo[] mortarPorts = _007B2726_007D.StaticInfo.MortarPorts;
			foreach (CannonLocationInfo cannonLocationInfo in mortarPorts)
			{
				if (!cannonLocationInfo.AvailableWithUpgrade)
				{
					CannonGameInfo cannonGameInfo = Gameplay.CannonsGameInfo.First((CannonGameInfo _007B2762_007D) => _007B2762_007D.Class == CannonClass.Mortar);
					playerShipDynamicInfo.Mortars[cannonLocationInfo.SectionID] = new CannonGameInstance(cannonGameInfo.ID, Gameplay.DestroyMortarResource(cannonGameInfo));
				}
			}
		}
		else
		{
			playerShipDynamicInfo.Cannons = new CannonCollection();
			if (playerShipDynamicInfo.Cannons.CheckStatic(_007B2726_007D.StaticInfo))
			{
				playerShipDynamicInfo.Cannons.UpdateInformation();
			}
		}
		playerShipDynamicInfo.ballsOfHold = new GSI();
		playerShipDynamicInfo.Crew = new UnitCollection();
		playerShipDynamicInfo.Upgrades = new UpgradesCollection();
		playerShipDynamicInfo.PrivateResourcesOfHold = new GSI();
		playerShipDynamicInfo.powderKegsOfHold = new GSI();
		playerShipDynamicInfo.designEmenents = new SlottedMap<ShipDesignInfo>();
		playerShipDynamicInfo.firstHP.SetFull(playerShipDynamicInfo.MaxHp);
		playerShipDynamicInfo.Integrity = _007B2726_007D.MaxIntegrity;
		return playerShipDynamicInfo;
	}

	internal static PlayerShipDynamicInfo CreateFromHolder(PlayerShipDynamicInfoHolder _007B2728_007D)
	{
		//IL_00f2: Unknown result type (might be due to invalid IL or missing references)
		//IL_00f7: Unknown result type (might be due to invalid IL or missing references)
		//IL_00fe: Unknown result type (might be due to invalid IL or missing references)
		//IL_0103: Unknown result type (might be due to invalid IL or missing references)
		PlayerShipDynamicInfo playerShipDynamicInfo = new PlayerShipDynamicInfo(_007B2728_007D.CraftFrom);
		playerShipDynamicInfo.Cannons = _007B2728_007D.Cannons;
		playerShipDynamicInfo.Mortars = _007B2728_007D.Mortars;
		playerShipDynamicInfo.firstHP = _007B2728_007D.FirstHP;
		int num = Math.Min(playerShipDynamicInfo.HitboxSailsStrength.Length, _007B2728_007D.FirstSailHP.Length);
		for (int i = 0; i < num; i++)
		{
			playerShipDynamicInfo.HitboxSailsStrength[i] = (float)(int)_007B2728_007D.FirstSailHP[i] / 255f;
		}
		playerShipDynamicInfo.HitboxSailsStrengthCacheUpdate();
		playerShipDynamicInfo.ballsOfHold = _007B2728_007D.BallsOfHold;
		playerShipDynamicInfo.Crew = _007B2728_007D.Crew;
		playerShipDynamicInfo.designEmenents = _007B2728_007D.DesignElementsNew ?? new SlottedMap<ShipDesignInfo>();
		playerShipDynamicInfo.UpdateDesingElementsBonuses();
		playerShipDynamicInfo.Upgrades = _007B2728_007D.Upgrades ?? new UpgradesCollection();
		playerShipDynamicInfo.PrivateResourcesOfHold = _007B2728_007D.ResourcesOfHold;
		playerShipDynamicInfo.powderKegsOfHold = _007B2728_007D.PowderKegsOfHold;
		if (playerShipDynamicInfo.powderKegsOfHold == null)
		{
			playerShipDynamicInfo.powderKegsOfHold = new GSI();
		}
		playerShipDynamicInfo.BigLampPosition = _007B2728_007D.DesignBigLampPosition;
		playerShipDynamicInfo.BowFigurePosition = _007B2728_007D.DesignBowFigurePosition;
		playerShipDynamicInfo.Decal1SelectedSailesBits.Value = _007B2728_007D.decal1SelectedSailes;
		playerShipDynamicInfo.Decal2SelectedSailesBits.Value = _007B2728_007D.decal2SelectedSailes;
		playerShipDynamicInfo.CustomName = _007B2728_007D.CustomName;
		playerShipDynamicInfo.Integrity = Math.Min(_007B2728_007D.CraftFrom.MaxIntegrity, _007B2728_007D.Integrity);
		playerShipDynamicInfo.firstHP.Check(playerShipDynamicInfo.MaxHp);
		playerShipDynamicInfo.PowerupItemSlots = _007B2728_007D.PowerupItemSlots;
		if (playerShipDynamicInfo.PrivateResourcesOfHold == null)
		{
			playerShipDynamicInfo.PrivateResourcesOfHold = new GSI();
		}
		playerShipDynamicInfo.ClientTimeToRestoreIntegrity = _007B2728_007D.ClientTimeToRestoreIntegrity;
		playerShipDynamicInfo.CannonsShouldMoveToStorage = _007B2728_007D.CannonsShouldMoveToStorage;
		playerShipDynamicInfo.hpFactorCached = playerShipDynamicInfo.HpFactor;
		playerShipDynamicInfo.TrophyShipNotification = _007B2728_007D.TrophyShip;
		return playerShipDynamicInfo;
	}

	public void RestoreIntegrity()
	{
		Integrity = CraftFrom.MaxIntegrity;
		ClientTimeToRestoreIntegrity = 0f;
	}

	public float GetItemsMass()
	{
		return ballsOfHold.ComputeMass<CannonBallInfo>() + PrivateResourcesOfHold.ComputeMass<ResourceInfo>() + powderKegsOfHold.ComputeMass<PowderKegInfo>();
	}

	public ShipDesignInfo SetDesignElement(ShipDesignInfo _007B2729_007D, int _007B2730_007D)
	{
		ShipDesignInfo result = designEmenents[_007B2730_007D];
		designEmenents[_007B2730_007D] = null;
		designEmenents[_007B2730_007D] = _007B2729_007D;
		UpdateDesingElementsBonuses();
		return result;
	}

	[IteratorStateMachine(typeof(_003CRemoveDesignElementsByCategory_003Ed__76))]
	public IEnumerable<ShipDesignInfo> RemoveDesignElementsByCategory(Func<ShipDesignCategory, bool> _007B2731_007D)
	{
		//yield-return decompiler failed: Method not found
		return new _003CRemoveDesignElementsByCategory_003Ed__76(-2)
		{
			_003C_003E4__this = this,
			_003C_003E3__check = _007B2731_007D
		};
	}

	public int RemoveDesignElementById(int _007B2732_007D)
	{
		int num = 0;
		for (int i = 0; i < designEmenents.Raw.Length; i++)
		{
			if (designEmenents.Raw[i] == _007B2732_007D)
			{
				designEmenents[i] = null;
				num++;
			}
		}
		if (num > 0)
		{
			UpdateDesingElementsBonuses();
		}
		return num;
	}

	public ShipDesignInfo RemoveDesignElement(int _007B2733_007D)
	{
		ShipDesignInfo shipDesignInfo = designEmenents[_007B2733_007D];
		if (shipDesignInfo != null)
		{
			designEmenents[_007B2733_007D] = null;
			UpdateDesingElementsBonuses();
		}
		return shipDesignInfo;
	}

	public ShipDesignInfo GetDesignElement(int _007B2734_007D)
	{
		return designEmenents[_007B2734_007D];
	}

	protected void UpdateDesingElementsBonuses()
	{
		_007B2758_007D.Clear();
		foreach (ShipDesignInfo item in designEmenents.Iterate(_007B390_007D: true))
		{
			for (int i = 0; i < item.Bonus.Length; i++)
			{
				_007B2758_007D.Add(in item.Bonus[i]);
			}
		}
	}

	public int CountInstallerDesignElements()
	{
		return designEmenents.Count;
	}

	public IEnumerable<ShipDesignInfo> EnumerateDesignElements()
	{
		return designEmenents.Iterate();
	}

	public void MakeArenaUpgrade(ArenaUpgradeInfo _007B2735_007D, Ship _007B2736_007D)
	{
		DynamicBonus.AddArenaUpgrade(_007B2735_007D);
		if (_007B2735_007D.Effect.Type == ShipBonusEffect.PHealth)
		{
			_007B2736_007D.RestoreHp(_007B2735_007D.Effect.Value / 100f * MaxHp);
		}
		if (_007B2735_007D.Effect.Type == ShipBonusEffect.MHealth)
		{
			_007B2736_007D.RestoreHp(_007B2735_007D.Effect.Value);
		}
	}

	public bool HasArenaUpgrades()
	{
		return DynamicBonus.TotalCountArenaUpgrades() > 0;
	}

	public byte[] GetArenaUpgrades()
	{
		return DynamicBonus.GetCompressedArenaUpgrades();
	}

	public void MakeArenaUpgrade(byte[] _007B2737_007D)
	{
		DynamicBonus.AddArenaUpgrade(_007B2737_007D);
	}

	public int GetItemsCountInHold(IStorageAsset _007B2738_007D)
	{
		StorageAssetEnum getType = _007B2738_007D.getType;
		if (1 == 0)
		{
		}
		int result = getType switch
		{
			StorageAssetEnum.SimpleItem => PrivateResourcesOfHold[_007B2738_007D.ID], 
			StorageAssetEnum.Ammo => ballsOfHold[_007B2738_007D.ID], 
			StorageAssetEnum.PowderKeg => powderKegsOfHold[_007B2738_007D.ID], 
			StorageAssetEnum.Unit_DiplayOnly => Crew.GetCount((UnitInfo)_007B2738_007D), 
			_ => throw new NotSupportedException(), 
		};
		if (1 == 0)
		{
		}
		return result;
	}

	public void AddOrRemoveItemsInHold(IStorageAsset _007B2739_007D, int _007B2740_007D)
	{
		switch (_007B2739_007D.getType)
		{
		case StorageAssetEnum.SimpleItem:
			PrivateResourcesOfHold.AddOrRemove(_007B2739_007D.ID, _007B2740_007D);
			break;
		case StorageAssetEnum.Ammo:
			ballsOfHold.AddOrRemove(_007B2739_007D.ID, _007B2740_007D);
			break;
		case StorageAssetEnum.PowderKeg:
			powderKegsOfHold.AddOrRemove(_007B2739_007D.ID, _007B2740_007D);
			break;
		case StorageAssetEnum.Unit_DiplayOnly:
			if (_007B2740_007D < 0)
			{
				throw new NotSupportedException();
			}
			Crew.Add((UnitInfo)_007B2739_007D, _007B2740_007D, _007B4675_007D: false);
			break;
		default:
			throw new NotSupportedException();
		}
	}

	public bool TryMakeFinsingBuff()
	{
		if (DynamicBonus.Stats[ShipBonusEffect.PMarchingSpeed] == 0f)
		{
			DynamicBonus.AddEffect(ShipBonusEffect.PMarchingSpeed, 10f, 120000f, 128);
			return true;
		}
		return false;
	}

	public int TakeOffAllCannons(PlayerAccount _007B2741_007D, Func<CannonCommon, bool> _007B2742_007D)
	{
		int num = 0;
		for (int i = 0; i < Cannons.Items.Size; i++)
		{
			CannonCommon cannonCommon = Cannons.Items.Array[i];
			if (!cannonCommon.Location.IsStatic && _007B2742_007D(cannonCommon))
			{
				_007B2741_007D.CannonsAtStorage.AddOrRemove(cannonCommon.GameInfo.ID, 1);
				Cannons.Items.FastRemoveAt(i);
				i--;
				num++;
			}
		}
		Cannons.UpdateInformation();
		return num;
	}

	public void TakeOffCannon(PlayerAccount _007B2743_007D, CannonLocationInfo _007B2744_007D)
	{
		if (_007B2744_007D.Mode == CannonLocationMode.Mortar)
		{
			throw new InvalidOperationException("TakeOffCannon doesn't fit");
		}
		if (TakeOffAllCannons(_007B2743_007D, (CannonCommon _007B2764_007D) => _007B2764_007D.Location == _007B2744_007D) == 0)
		{
			throw new InvalidOperationException("TakeOffCannon");
		}
	}

	public void TakeOffMortar(PlayerAccount _007B2745_007D, CannonLocationInfo _007B2746_007D)
	{
		if (_007B2746_007D.Mode != CannonLocationMode.Mortar)
		{
			throw new InvalidOperationException("TakeOffMortar doesn't fit");
		}
		if (Mortars[_007B2746_007D.SectionID] != null)
		{
			TakeOffMortar(_007B2745_007D, Mortars[_007B2746_007D.SectionID]);
		}
	}

	public void TakeOffMortar(PlayerAccount _007B2747_007D, CannonGameInstance _007B2748_007D)
	{
		if (_007B2748_007D.Info.Class != CannonClass.Mortar)
		{
			throw new InvalidOperationException("TakeOffMortar doesn't fit");
		}
		if (Mortars.Remove(_007B2748_007D))
		{
			if (_007B2748_007D.IsWholeMortar)
			{
				_007B2747_007D.CannonsAtStorage[_007B2748_007D.InfoID]++;
			}
			else
			{
				_007B2747_007D.UsedMortarsAtStorage.Add(in _007B2748_007D);
			}
		}
	}

	public void TakeOffAllCannonsAndMortars(PlayerAccount _007B2749_007D)
	{
		TakeOffAllCannons(_007B2749_007D, (CannonCommon _007B2763_007D) => true);
		TakeOffAllMortars(_007B2749_007D);
	}

	public void TakeOffAllMortars(PlayerAccount _007B2750_007D)
	{
		foreach (CannonGameInstance mortar in Mortars)
		{
			CannonGameInstance item = mortar;
			if (item.IsWholeMortar)
			{
				_007B2750_007D.CannonsAtStorage[item.InfoID]++;
			}
			else
			{
				_007B2750_007D.UsedMortarsAtStorage.Add(in item);
			}
		}
		Mortars.Clean();
	}

	public bool SetCannon(PlayerAccount _007B2751_007D, CannonLocationInfo _007B2752_007D, CannonGameInfo _007B2753_007D)
	{
		if (_007B2752_007D.Mode == CannonLocationMode.Special && _007B2753_007D.Class != CannonClass.Special)
		{
			return false;
		}
		CannonCommon item = Cannons.FindByLocation(_007B2752_007D.SectionID);
		if (item != null)
		{
			Cannons.Items.FastRemove(in item);
			_007B2751_007D.CannonsAtStorage.AddOrRemove(item.GameInfo.ID, 1);
		}
		_007B2751_007D.CannonsAtStorage.AddOrRemove(_007B2753_007D.ID, -1);
		Cannons.Items.Add(new CannonCommon(_007B2752_007D, _007B2753_007D));
		Cannons.Items.Last().RollbackEffectMax = 1000f;
		Cannons.Items.Last().RollbackEffect = 600f;
		Cannons.UpdateInformation();
		return true;
	}

	public bool SetMortar(PlayerAccount _007B2754_007D, CannonLocationInfo _007B2755_007D, CannonGameInstance _007B2756_007D)
	{
		if (_007B2755_007D.Mode != CannonLocationMode.Mortar)
		{
			throw new InvalidOperationException();
		}
		TakeOffMortar(_007B2754_007D, _007B2755_007D);
		Mortars[_007B2755_007D.SectionID] = _007B2756_007D;
		if (!_007B2754_007D.UsedMortarsAtStorage.Remove(in _007B2756_007D))
		{
			_007B2754_007D.CannonsAtStorage.AddOrRemove(_007B2756_007D.InfoID, -1);
		}
		return true;
	}

	public void TakeOffAllDesingElements(PlayerAccount _007B2757_007D)
	{
		foreach (ShipDesignInfo item in designEmenents.Iterate())
		{
			_007B2757_007D.DesingElementsAtStorage.AddOrRemove(item.ID, 1);
		}
		designEmenents.Clean();
	}
}
