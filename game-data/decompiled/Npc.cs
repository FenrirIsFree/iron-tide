using System;
using Common.Resources;

namespace Common.Game;

public abstract class Npc : Ship
{
	public int UidPlayerForCaper = -1;

	private NpcShipDynamicInfo _007B4860_007D;

	public NpcShipDynamicInfo UsedShipNpc => (NpcShipDynamicInfo)UsedShip;

	public bool IsPlayerCaper => UidPlayerForCaper != -1;

	protected override ShipDynamicInfo AskActualShip => _007B4860_007D;

	public bool IsActiveWanderingTrader => UsedShipNpc.Information.Descritpion == NpcType.Trader_Ferryman && UsedShip.HpFactor >= 1f && !IsPlayerCaper;

	public override float PalyerMarchingModeBonus => 5f;

	public Npc()
	{
	}

	public override void ClearResources()
	{
		if (_007B4860_007D != null)
		{
			_007B4860_007D.Cannons.Dispose();
		}
		_007B4860_007D = null;
		FirstController.Change = null;
		UidPlayerForCaper = -1;
		base.ClearResources();
	}

	protected void InternalInitialize(ShipPositionInfo _007B4849_007D, NpcInfo _007B4850_007D, int _007B4851_007D, WorldMapInfo _007B4852_007D, object _007B4853_007D)
	{
		_007B4860_007D = new NpcShipDynamicInfo(_007B4850_007D, _007B4852_007D, _007B4853_007D, _007B4851_007D);
		Initialize(_007B4851_007D, _007B4849_007D, _007B4852_007D);
		ShipKeyController firstController = FirstController;
		firstController.Change = (Action)Delegate.Combine(firstController.Change, new Action(base.UpdateSailClotting));
	}

	protected void InternalInitialize(NpcCreatePacket _007B4854_007D, WorldMapInfo _007B4855_007D, object _007B4856_007D)
	{
		_007B4860_007D = NpcShipDynamicInfo.CreateFromPacket(_007B4854_007D, _007B4855_007D, _007B4856_007D);
		Initialize(_007B4854_007D.uID, _007B4854_007D.PositionInfo, _007B4855_007D);
		ShipKeyController firstController = FirstController;
		firstController.Change = (Action)Delegate.Combine(firstController.Change, new Action(base.UpdateSailClotting));
	}

	public override void MakeDamage(in DamageData _007B4857_007D, int _007B4858_007D)
	{
		base.MakeDamage(in _007B4857_007D, _007B4858_007D);
		if (!base.IsDestroyed)
		{
			UsedShipNpc.MinAchievedSailStrength = Math.Min(UsedShipNpc.MinAchievedSailStrength, UsedShip.FirstSailHP);
		}
	}

	public virtual bool IsAllyByCaper(int _007B4859_007D)
	{
		return UidPlayerForCaper == _007B4859_007D || (!MapInfo.IsWorldmap && IsPlayerCaper);
	}
}
