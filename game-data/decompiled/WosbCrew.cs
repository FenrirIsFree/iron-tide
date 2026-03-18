using System;
using System.Collections.Generic;
using System.Linq;
using Common.Account;
using Common.Resources;
using CommonDataTypes;
using Microsoft.Xna.Framework;
using TheraEngine.Collections;
using TheraEngine.Helpers;

namespace Common.Game;

public static class WosbCrew
{
	public static Dictionary<SpecialUnitClass, SpecialUnitClass[]> SpecialUnitsConflicts = new Dictionary<SpecialUnitClass, SpecialUnitClass[]>
	{
		[SpecialUnitClass.Pirates] = new SpecialUnitClass[1],
		[SpecialUnitClass.Combats] = new SpecialUnitClass[1] { SpecialUnitClass.Pirates }
	};

	public static float HoursToFullRefilLimit = 12f;

	public static readonly ShipBonus[] BonusesForSatiety = new ShipBonus[5]
	{
		new ShipBonus(ShipBonusEffect.PChangeShipSpeedBonus, 5f),
		new ShipBonus(ShipBonusEffect.PPowerupItemsReload, 5f),
		new ShipBonus(ShipBonusEffect.PMendingEffectivity, 12f),
		new ShipBonus(ShipBonusEffect.PCannonsReload, 5f),
		new ShipBonus(ShipBonusEffect.PPlayerSightFocusSpeedAdd, 8f)
	};

	internal static readonly StaticEffectsCalculator BonusesForSatietyLookup = new StaticEffectsCalculator(BonusesForSatiety);

	private static float ChanseMultiplier(PlayerAccount _007B3941_007D)
	{
		return MathHelper.Clamp(1f - (float)(_007B3941_007D.SpecialUnitsAtStorage.TotalCount - 500) / 1000f, 0.33f, 1f);
	}

	internal static float WeaponsReloadingSpeedByCrew(float _007B3942_007D, float _007B3943_007D)
	{
		float num = Math.Min(1f, _007B3942_007D / _007B3943_007D);
		return num + num * (1f - num) / 2f * 0.75f;
	}

	public static bool ImproveSpecialUnitGettingChanse(PlayerAccount _007B3944_007D)
	{
		int totalCount = _007B3944_007D.SpecialUnitsAtStorage.TotalCount;
		if (totalCount > 5)
		{
			return false;
		}
		totalCount += _007B3944_007D.Shipyard.List.Sum((PlayerShipDynamicInfo _007B3971_007D) => _007B3971_007D.Crew.Special.Size);
		return totalCount <= 6;
	}

	public static UnitInfo GetSpecialUnitWhenSuccessBoarding(Player _007B3945_007D, NpcInfo _007B3946_007D)
	{
		NpcType descritpion = _007B3946_007D.Descritpion;
		if ((uint)(descritpion - 10) <= 1u)
		{
			float num = _007B3945_007D.UsedShip.GetSpecialUnitChanseBonusImperal;
			if (_007B3945_007D.IsOutsideSeam)
			{
				num *= 0.66f;
			}
			if (Rand.Chanse(100f * num * ChanseMultiplier(_007B3945_007D.AccountConnection)))
			{
				return RandUnitHelper(_007B3945_007D.AccountConnection, (UnitInfo _007B3972_007D) => _007B3972_007D.SpecialUnitClass != SpecialUnitClass.Adventurers);
			}
		}
		descritpion = _007B3946_007D.Descritpion;
		bool flag = (uint)(descritpion - 12) <= 1u;
		if (flag || (_007B3946_007D.Extras.IsPirate && _007B3946_007D.Extras.IsReinforcedType))
		{
			float num2 = ((_007B3946_007D.Descritpion == NpcType.Empire_Legendary3l) ? 1f : ((_007B3946_007D.Descritpion == NpcType.Empire_Legendary2l) ? 0.8f : 0.2f));
			if (ImproveSpecialUnitGettingChanse(_007B3945_007D.AccountConnection))
			{
				num2 *= 2f;
			}
			if (Rand.Chanse(100f * num2 * ChanseMultiplier(_007B3945_007D.AccountConnection)))
			{
				return Gameplay.AllSpecialUnits.Rand();
			}
		}
		return null;
	}

	public static SpecialUnitInstance[] GetRandomSpecialUnitsWithClass(SpecialUnitClass _007B3947_007D, int _007B3948_007D)
	{
		UnitInfo[] array = (from _007B3973_007D in Gameplay.AllSpecialUnits
			where _007B3973_007D.SpecialUnitClass == _007B3947_007D
			orderby Rand.RangeInt(0, 1000000)
			select _007B3973_007D).ToArray();
		SpecialUnitInstance[] array2 = new SpecialUnitInstance[_007B3948_007D];
		for (int num = 0; num < _007B3948_007D; num++)
		{
			array2[num] = new SpecialUnitInstance(array[num].ID);
		}
		return array2;
	}

	public static float TavernaSpecialUnitGetChanse(in Decorator _007B3949_007D, Player _007B3950_007D)
	{
		if (_007B3950_007D.AccountConnection.TavernaSpecialUnitGetTimeoutSec > 0f)
		{
			return ImproveSpecialUnitGettingChanse(_007B3950_007D.AccountConnection) ? 0.03f : 0.015f;
		}
		return ImproveSpecialUnitGettingChanse(_007B3950_007D.AccountConnection) ? 0.45f : 0.15f;
	}

	public static UnitInfo TryGetTavernaSpecialUnit(in Decorator _007B3951_007D, Player _007B3952_007D)
	{
		if (_007B3952_007D.AccountConnection.Rang <= 9)
		{
			return null;
		}
		if (Rand.Chanse(TavernaSpecialUnitGetChanse(in _007B3951_007D, _007B3952_007D) * 100f * ChanseMultiplier(_007B3952_007D.AccountConnection)))
		{
			_007B3952_007D.AccountConnection.TavernaSpecialUnitGetTimeoutSec = 43200f;
			bool isPirate = _007B3952_007D.NearPort.Type == PortType.PirateBay || _007B3951_007D.NearPortStatus.CapturerFraction == FractionID.Pirate;
			return RandUnitHelper(_007B3952_007D.AccountConnection, (UnitInfo _007B3980_007D) => isPirate ? (_007B3980_007D.SpecialUnitClass == SpecialUnitClass.Pirates) : (_007B3980_007D.SpecialUnitClass != SpecialUnitClass.Pirates));
		}
		return null;
	}

	public static UnitInfo GetPersonalIsleSpecialUnit(in Decorator _007B3953_007D, SpecialUnitClass? _007B3954_007D, Player _007B3955_007D)
	{
		return RandUnitHelper(_007B3955_007D.AccountConnection, (UnitInfo _007B3981_007D) => (!_007B3954_007D.HasValue && _007B3981_007D.SpecialUnitClass != SpecialUnitClass.Adventurers) || _007B3954_007D == _007B3981_007D.SpecialUnitClass);
	}

	internal static UnitInfo GetSpecialUnitOnRaft()
	{
		return Gameplay.AllSpecialUnits.Rand((UnitInfo _007B3974_007D) => _007B3974_007D.SpecialUnitClass == SpecialUnitClass.Adventurers);
	}

	public static GSI GetSpecialUnitFromKilledNpc(Player _007B3956_007D, Npc _007B3957_007D)
	{
		if (_007B3957_007D.MapInfo is MapForPassingInfo mapForPassingInfo)
		{
			float num = 0.5f + _007B3956_007D.UsedShip.GetSpecialUnitChanseBonusGameModes * 1.25f;
			if (Rand.Chanse(num * 4f * 100f * (float)mapForPassingInfo.PlayersCount / (float)mapForPassingInfo.WavesNPCS.Sum((PassingMapNpcWaveInfo _007B3975_007D) => _007B3975_007D.WaveInfo.Sum((NpcWaveInfo _007B3976_007D) => _007B3976_007D.Count)) * ChanseMultiplier(_007B3956_007D.AccountConnection)))
			{
				return new GSI().Exs(RandUnitHelper(_007B3956_007D.AccountConnection, (UnitInfo _007B3977_007D) => true).ID, 1);
			}
		}
		return null;
	}

	private static UnitInfo RandUnitHelper(PlayerAccount _007B3958_007D, Func<UnitInfo, bool> _007B3959_007D)
	{
		Tlist<UnitInfo> tlist = new Tlist<UnitInfo>(Gameplay.AllSpecialUnits.Where(_007B3959_007D));
		tlist.RemoveAll((UnitInfo _007B3978_007D) => _007B3958_007D.SpecialUnitsAtStorage.Count(_007B3978_007D.ID) > 0);
		if (tlist.Size == 0)
		{
			return Gameplay.AllSpecialUnits.Rand(_007B3959_007D);
		}
		float num = MathHelper.Lerp(0.1f, 0.5f, (float)tlist.Size / (float)Gameplay.AllSpecialUnits.Size);
		if (Rand.Range(0f, 1f) < num)
		{
			return tlist.Rand();
		}
		return Gameplay.AllSpecialUnits.Rand(_007B3959_007D);
	}

	internal static UnitCollection CreateNpcCrew(NpcInfo _007B3960_007D, int _007B3961_007D)
	{
		UnitCollection unitCollection = new UnitCollection();
		float num = (float)(_007B3960_007D.DefaultCrewAmount + _007B3961_007D) - Rand.Range(0f, 1f);
		int[] _007B14485_007D = new int[3] { 2, 3, 4 };
		unitCollection.Add(Gameplay.UnitsInfo.FromID(1), Rand.Round(num / 2f), _007B4675_007D: false);
		int _007B3506_007D = Rand.Pick(_007B14485_007D);
		int _007B3506_007D2 = Rand.Pick(_007B14485_007D);
		unitCollection.Add(Gameplay.UnitsInfo.FromID(_007B3506_007D), Rand.Round(num / 4f), _007B4675_007D: false);
		unitCollection.Add(Gameplay.UnitsInfo.FromID(_007B3506_007D2), Rand.Round(num / 4f), _007B4675_007D: false);
		return unitCollection;
	}

	public static int GetCrewAverageLimit(PortEnteringType _007B3962_007D, in Decorator _007B3963_007D)
	{
		int num = _007B3962_007D switch
		{
			PortEnteringType.PersonalIsle => 250, 
			PortEnteringType.Port => _007B3963_007D.NearPortCrewHireLimit, 
			_ => 150, 
		};
		if (_007B3963_007D.account.Rang < 10)
		{
			num /= 2;
		}
		return num;
	}

	public static int GetCrewHirePrice(UnitInfo _007B3964_007D, PortEnteringType _007B3965_007D, int _007B3966_007D, in Decorator _007B3967_007D)
	{
		float val = 1.2f * (float)_007B3966_007D / (float)GetCrewAverageLimit(_007B3965_007D, in _007B3967_007D);
		return (int)Math.Round(MathHelper.Lerp((float)(2 * _007B3964_007D.CostGold.Value), (float)_007B3964_007D.CostGold.Value, Math.Min(val, 1f)));
	}

	public unsafe static GSI GenerateCrewLimitsFor(PortEnteringType _007B3968_007D, Vector2 _007B3969_007D, in Decorator _007B3970_007D)
	{
		int hashCode = ((object)(*(Vector2*)(&_007B3969_007D))/*cast due to .constrained prefix*/).GetHashCode();
		int crewAverageLimit = GetCrewAverageLimit(_007B3968_007D, in _007B3970_007D);
		GSI gSI = new GSI();
		foreach (UnitInfo item in (IEnumerable<UnitInfo>)Gameplay.UnitsInfo)
		{
			if (item.Type == UnitType.Sailor)
			{
				gSI[item.ID] += (int)((float)crewAverageLimit * 1.25f) + HashHelper.greaterInt(hashCode++, (int)((float)crewAverageLimit * 0.5f));
			}
			if (item.Type == UnitType.Boarding)
			{
				gSI[item.ID] += (int)((float)crewAverageLimit * 0.75f) + HashHelper.greaterInt(hashCode++, (int)((float)crewAverageLimit * 0.5f));
			}
		}
		return gSI;
	}
}
