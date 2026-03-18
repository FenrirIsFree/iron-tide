#define DEBUG
using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Runtime.CompilerServices;
using Common.Data;
using Common.Game;
using Common.Packets;
using CommonDataTypes;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using TheraEngine;
using TheraEngine.Collections;
using TheraEngine.Graphics.Models;
using TheraEngine.Helpers;
using TheraEngine.PacketValues;
using UWContentPipelineExtensionRuntime;
using UWContentPipelineExtensionRuntime.Tags;
using UWPhysicsWOSLib;
using UWPhysicsWOSLib.Shapes;

namespace Common.Resources;

public class ShipStaticInfo : XmlAsset<ShipStaticInfoToken>
{
	private struct ContactData : IComparer<ContactData>
	{
		public CannonLocationInfo With;

		public int WithIndex;

		public float DotProduct;

		public Vector2 DVector;

		public float Distance;

		private int _007B2564_007D(ContactData _007B2565_007D, ContactData _007B2566_007D)
		{
			return (_007B2565_007D.Distance > _007B2566_007D.Distance) ? 1 : ((_007B2565_007D.Distance < _007B2566_007D.Distance) ? (-1) : 0);
		}

		int IComparer<ContactData>.Compare(ContactData _007B2565_007D, ContactData _007B2566_007D)
		{
			//ILSpy generated this explicit interface implementation from .override directive in {2564}
			return this._007B2564_007D(_007B2565_007D, _007B2566_007D);
		}
	}

	[CompilerGenerated]
	private sealed class _003CFetchMortars_003Ed__69 : IEnumerable<(CannonLocationInfo location, CannonGameInfo mortar)>, IEnumerable, IEnumerator<(CannonLocationInfo location, CannonGameInfo mortar)>, IEnumerator, IDisposable
	{
		private int _007B2586_007D;

		private (CannonLocationInfo location, CannonGameInfo mortar) _007B2587_007D;

		private int _007B2588_007D;

		private bool _007B2589_007D;

		public bool _003C_003E3__isFront;

		private ShipDynamicInfo _007B2590_007D;

		public ShipDynamicInfo _003C_003E3__src;

		public ShipStaticInfo _003C_003E4__this;

		private CannonLocationInfo[] _007B2591_007D;

		private int _007B2592_007D;

		private CannonLocationInfo _007B2593_007D;

		private CannonGameInstance _007B2594_007D;

		(CannonLocationInfo location, CannonGameInfo mortar) IEnumerator<(CannonLocationInfo, CannonGameInfo)>.Current
		{
			[DebuggerHidden]
			get
			{
				return _007B2587_007D;
			}
		}

		object IEnumerator.Current
		{
			[DebuggerHidden]
			get
			{
				return _007B2587_007D;
			}
		}

		[DebuggerHidden]
		public _003CFetchMortars_003Ed__69(int _007B2581_007D)
		{
			_007B2586_007D = _007B2581_007D;
			_007B2588_007D = Environment.CurrentManagedThreadId;
		}

		[DebuggerHidden]
		private void _007B2582_007D()
		{
			_007B2591_007D = null;
			_007B2593_007D = null;
			_007B2594_007D = null;
			_007B2586_007D = -2;
		}

		void IDisposable.Dispose()
		{
			//ILSpy generated this explicit interface implementation from .override directive in {2582}
			this._007B2582_007D();
		}

		private bool _007B2583_007D()
		{
			int num = _007B2586_007D;
			if (num != 0)
			{
				if (num != 1)
				{
					return false;
				}
				_007B2586_007D = -1;
				_007B2594_007D = null;
				_007B2593_007D = null;
				goto IL_00f0;
			}
			_007B2586_007D = -1;
			_007B2591_007D = _003C_003E4__this.MortarPorts;
			_007B2592_007D = 0;
			goto IL_00fe;
			IL_00f0:
			_007B2592_007D++;
			goto IL_00fe;
			IL_00fe:
			if (_007B2592_007D < _007B2591_007D.Length)
			{
				_007B2593_007D = _007B2591_007D[_007B2592_007D];
				if (_007B2589_007D == (_007B2593_007D.Side == CannonLocation.InFront) && !_007B2593_007D.IsBlocked(_007B2590_007D))
				{
					_007B2594_007D = _007B2590_007D.Mortars[_007B2593_007D.SectionID];
					if (_007B2594_007D != null)
					{
						_007B2587_007D = (location: _007B2593_007D, mortar: _007B2594_007D.Info);
						_007B2586_007D = 1;
						return true;
					}
				}
				goto IL_00f0;
			}
			_007B2591_007D = null;
			return false;
		}

		bool IEnumerator.MoveNext()
		{
			//ILSpy generated this explicit interface implementation from .override directive in {2583}
			return this._007B2583_007D();
		}

		[DebuggerHidden]
		private void _007B2584_007D()
		{
			throw new NotSupportedException();
		}

		void IEnumerator.Reset()
		{
			//ILSpy generated this explicit interface implementation from .override directive in {2584}
			this._007B2584_007D();
		}

		[DebuggerHidden]
		IEnumerator<(CannonLocationInfo location, CannonGameInfo mortar)> IEnumerable<(CannonLocationInfo, CannonGameInfo)>.GetEnumerator()
		{
			_003CFetchMortars_003Ed__69 _003CFetchMortars_003Ed__;
			if (_007B2586_007D == -2 && _007B2588_007D == Environment.CurrentManagedThreadId)
			{
				_007B2586_007D = 0;
				_003CFetchMortars_003Ed__ = this;
			}
			else
			{
				_003CFetchMortars_003Ed__ = new _003CFetchMortars_003Ed__69(0)
				{
					_003C_003E4__this = _003C_003E4__this
				};
			}
			_003CFetchMortars_003Ed__._007B2589_007D = _003C_003E3__isFront;
			_003CFetchMortars_003Ed__._007B2590_007D = _003C_003E3__src;
			return _003CFetchMortars_003Ed__;
		}

		[DebuggerHidden]
		private IEnumerator _007B2585_007D()
		{
			return ((IEnumerable<(CannonLocationInfo, CannonGameInfo)>)this).GetEnumerator();
		}

		IEnumerator IEnumerable.GetEnumerator()
		{
			//ILSpy generated this explicit interface implementation from .override directive in {2585}
			return this._007B2585_007D();
		}
	}

	public readonly CannonLocationInfo[] RightSidePorts;

	public readonly CannonLocationInfo[] LeftSidePorts;

	public readonly CannonLocationInfo[] FrontSidePorts;

	public readonly CannonLocationInfo[] BackSidePorts;

	public readonly CannonLocationInfo[] MortarPorts;

	public readonly Vector2 CannonMax;

	public readonly Vector2 CannonMin;

	public readonly float MiddleCannonsHeight;

	public readonly float RearCannonsBindCamera;

	public readonly float BackCannonsBindCamera;

	public readonly float LeftCannonsBindCamera;

	public readonly FalkonetLocationInfo[] FalkonetPositions;

	public float WaterlineOffset;

	public readonly float Weight;

	public readonly int SpecialCannonsCount;

	public readonly Tlist<(Vector3, float)> GunneryCrewPositions;

	public Tlist<(Vector3, float)> CrewPositions;

	public Vector3 MaxCrewPosition;

	public Vector3 MinCrewPosition;

	public readonly Tlist<Tlist<CannonLocationInfo>> Decks;

	public readonly bool HasUniqueWindRose;

	public readonly Vector3 BowFigurePosition;

	public ShipDesignInfo PreinstalledBowFigure;

	public readonly Tlist<DeckCoverModelInfo> DeckCoverModelInstances;

	public readonly Tlist<Matrix> PaddleModelInstances;

	public readonly Tlist<Matrix> SmallLights;

	public readonly float InertionFactor;

	public readonly float HardnessFactor;

	public readonly CannonLocationInfo[] Ports;

	public float FrontWaveCut;

	public float BackWaveCut;

	public readonly ShipModelContent Model;

	internal readonly CorpusHitbox CorpusHitbox;

	public BoxShape? EditorBoxShape;

	public MastHitbox[] MastHitboxes;

	public SailHitbox[] SailHitboxes;

	public Tlist<IShipHitbox> HitboxTableByNodeID;

	public readonly BoundingSphere BSphere;

	public readonly float BSRadius;

	public readonly float BSRadiusMax;

	public readonly Bits32 AnimatedSailesBits;

	public readonly bool IsBalloon;

	public readonly bool HasSteamWheel;

	public readonly float CorpusHalfLength;

	public readonly float CorpusHalfWidth;

	public readonly float CorpusHalfHeight;

	internal Tlist<(Vector3, float)> CrewPositions_Double;

	internal SailHitbox SailRemovedWithMortar;

	private readonly Vector2 _007B2560_007D;

	private readonly Vector2 _007B2561_007D;

	private string _007B2562_007D;

	private readonly float _007B2563_007D;

	public BoxShape CorpusShape => EditorBoxShape ?? CorpusHitbox.Shape;

	public float ChangeBallsSpeedMul => 0.25f + 4f / ((float)(15 + LeftSidePorts.Length) / 25f);

	public float SingleModeShotInterval => 800f / MathHelper.Clamp((float)LeftSidePorts.Length / 14f, 2f, 3.5f);

	public ShipStaticInfo(ShipStaticInfoToken _007B2524_007D, int _007B2525_007D, Model _007B2526_007D, Model _007B2527_007D)
		: base(_007B2525_007D)
	{
		//IL_0082: Unknown result type (might be due to invalid IL or missing references)
		//IL_008d: Unknown result type (might be due to invalid IL or missing references)
		//IL_0156: Unknown result type (might be due to invalid IL or missing references)
		//IL_0173: Unknown result type (might be due to invalid IL or missing references)
		//IL_021a: Unknown result type (might be due to invalid IL or missing references)
		//IL_0225: Unknown result type (might be due to invalid IL or missing references)
		//IL_022a: Unknown result type (might be due to invalid IL or missing references)
		//IL_022f: Unknown result type (might be due to invalid IL or missing references)
		//IL_07d1: Unknown result type (might be due to invalid IL or missing references)
		//IL_07d6: Unknown result type (might be due to invalid IL or missing references)
		//IL_07e6: Unknown result type (might be due to invalid IL or missing references)
		//IL_07eb: Unknown result type (might be due to invalid IL or missing references)
		//IL_034b: Unknown result type (might be due to invalid IL or missing references)
		//IL_0350: Unknown result type (might be due to invalid IL or missing references)
		//IL_0443: Unknown result type (might be due to invalid IL or missing references)
		//IL_0448: Unknown result type (might be due to invalid IL or missing references)
		//IL_0369: Unknown result type (might be due to invalid IL or missing references)
		//IL_0808: Unknown result type (might be due to invalid IL or missing references)
		//IL_080f: Unknown result type (might be due to invalid IL or missing references)
		//IL_0814: Unknown result type (might be due to invalid IL or missing references)
		//IL_0819: Unknown result type (might be due to invalid IL or missing references)
		//IL_081e: Unknown result type (might be due to invalid IL or missing references)
		//IL_0825: Unknown result type (might be due to invalid IL or missing references)
		//IL_082c: Unknown result type (might be due to invalid IL or missing references)
		//IL_0831: Unknown result type (might be due to invalid IL or missing references)
		//IL_0836: Unknown result type (might be due to invalid IL or missing references)
		//IL_083b: Unknown result type (might be due to invalid IL or missing references)
		//IL_0461: Unknown result type (might be due to invalid IL or missing references)
		//IL_0387: Unknown result type (might be due to invalid IL or missing references)
		//IL_03b1: Unknown result type (might be due to invalid IL or missing references)
		//IL_03c5: Unknown result type (might be due to invalid IL or missing references)
		//IL_03ca: Unknown result type (might be due to invalid IL or missing references)
		//IL_03cf: Unknown result type (might be due to invalid IL or missing references)
		//IL_03d1: Unknown result type (might be due to invalid IL or missing references)
		//IL_03e5: Unknown result type (might be due to invalid IL or missing references)
		//IL_03ea: Unknown result type (might be due to invalid IL or missing references)
		//IL_03ef: Unknown result type (might be due to invalid IL or missing references)
		//IL_03f7: Unknown result type (might be due to invalid IL or missing references)
		//IL_04a4: Unknown result type (might be due to invalid IL or missing references)
		//IL_04a6: Unknown result type (might be due to invalid IL or missing references)
		//IL_04ab: Unknown result type (might be due to invalid IL or missing references)
		//IL_04ad: Unknown result type (might be due to invalid IL or missing references)
		//IL_04b2: Unknown result type (might be due to invalid IL or missing references)
		//IL_04b7: Unknown result type (might be due to invalid IL or missing references)
		//IL_04b9: Unknown result type (might be due to invalid IL or missing references)
		//IL_04be: Unknown result type (might be due to invalid IL or missing references)
		//IL_04c3: Unknown result type (might be due to invalid IL or missing references)
		//IL_04c8: Unknown result type (might be due to invalid IL or missing references)
		//IL_04cd: Unknown result type (might be due to invalid IL or missing references)
		//IL_090a: Unknown result type (might be due to invalid IL or missing references)
		//IL_0922: Unknown result type (might be due to invalid IL or missing references)
		//IL_0931: Unknown result type (might be due to invalid IL or missing references)
		//IL_09a9: Unknown result type (might be due to invalid IL or missing references)
		//IL_09c1: Unknown result type (might be due to invalid IL or missing references)
		//IL_09d5: Unknown result type (might be due to invalid IL or missing references)
		//IL_09da: Unknown result type (might be due to invalid IL or missing references)
		//IL_09e9: Unknown result type (might be due to invalid IL or missing references)
		//IL_05c6: Unknown result type (might be due to invalid IL or missing references)
		//IL_0a60: Unknown result type (might be due to invalid IL or missing references)
		//IL_0a78: Unknown result type (might be due to invalid IL or missing references)
		//IL_0a87: Unknown result type (might be due to invalid IL or missing references)
		//IL_0afe: Unknown result type (might be due to invalid IL or missing references)
		//IL_0612: Unknown result type (might be due to invalid IL or missing references)
		//IL_0617: Unknown result type (might be due to invalid IL or missing references)
		//IL_061c: Unknown result type (might be due to invalid IL or missing references)
		//IL_0634: Unknown result type (might be due to invalid IL or missing references)
		//IL_0639: Unknown result type (might be due to invalid IL or missing references)
		//IL_063b: Unknown result type (might be due to invalid IL or missing references)
		//IL_0b16: Unknown result type (might be due to invalid IL or missing references)
		//IL_0b25: Unknown result type (might be due to invalid IL or missing references)
		//IL_0b92: Unknown result type (might be due to invalid IL or missing references)
		//IL_0ba1: Unknown result type (might be due to invalid IL or missing references)
		//IL_0685: Unknown result type (might be due to invalid IL or missing references)
		//IL_068a: Unknown result type (might be due to invalid IL or missing references)
		//IL_06c3: Unknown result type (might be due to invalid IL or missing references)
		//IL_0717: Unknown result type (might be due to invalid IL or missing references)
		//IL_0756: Unknown result type (might be due to invalid IL or missing references)
		//IL_072f: Unknown result type (might be due to invalid IL or missing references)
		//IL_0734: Unknown result type (might be due to invalid IL or missing references)
		//IL_0d17: Unknown result type (might be due to invalid IL or missing references)
		//IL_0d1c: Unknown result type (might be due to invalid IL or missing references)
		//IL_0d27: Unknown result type (might be due to invalid IL or missing references)
		//IL_0d2c: Unknown result type (might be due to invalid IL or missing references)
		//IL_0e15: Unknown result type (might be due to invalid IL or missing references)
		//IL_0e1f: Unknown result type (might be due to invalid IL or missing references)
		//IL_0e24: Unknown result type (might be due to invalid IL or missing references)
		//IL_0e2b: Unknown result type (might be due to invalid IL or missing references)
		//IL_0e35: Unknown result type (might be due to invalid IL or missing references)
		//IL_0e3a: Unknown result type (might be due to invalid IL or missing references)
		//IL_0dfc: Unknown result type (might be due to invalid IL or missing references)
		//IL_0e01: Unknown result type (might be due to invalid IL or missing references)
		//IL_0e08: Unknown result type (might be due to invalid IL or missing references)
		//IL_0e0d: Unknown result type (might be due to invalid IL or missing references)
		//IL_0d6f: Unknown result type (might be due to invalid IL or missing references)
		//IL_0d8c: Unknown result type (might be due to invalid IL or missing references)
		//IL_0d91: Unknown result type (might be due to invalid IL or missing references)
		//IL_0d96: Unknown result type (might be due to invalid IL or missing references)
		//IL_0d9d: Unknown result type (might be due to invalid IL or missing references)
		//IL_0dba: Unknown result type (might be due to invalid IL or missing references)
		//IL_0dbf: Unknown result type (might be due to invalid IL or missing references)
		//IL_0dc4: Unknown result type (might be due to invalid IL or missing references)
		//IL_0ec4: Unknown result type (might be due to invalid IL or missing references)
		//IL_115f: Unknown result type (might be due to invalid IL or missing references)
		//IL_116a: Unknown result type (might be due to invalid IL or missing references)
		//IL_1175: Unknown result type (might be due to invalid IL or missing references)
		//IL_117f: Unknown result type (might be due to invalid IL or missing references)
		//IL_1184: Unknown result type (might be due to invalid IL or missing references)
		//IL_1372: Unknown result type (might be due to invalid IL or missing references)
		//IL_1377: Unknown result type (might be due to invalid IL or missing references)
		//IL_138e: Unknown result type (might be due to invalid IL or missing references)
		//IL_1393: Unknown result type (might be due to invalid IL or missing references)
		//IL_1196: Unknown result type (might be due to invalid IL or missing references)
		//IL_11a1: Unknown result type (might be due to invalid IL or missing references)
		//IL_143c: Unknown result type (might be due to invalid IL or missing references)
		//IL_13a0: Unknown result type (might be due to invalid IL or missing references)
		//IL_13b7: Unknown result type (might be due to invalid IL or missing references)
		//IL_13bc: Unknown result type (might be due to invalid IL or missing references)
		//IL_13c1: Unknown result type (might be due to invalid IL or missing references)
		//IL_13c8: Unknown result type (might be due to invalid IL or missing references)
		//IL_13df: Unknown result type (might be due to invalid IL or missing references)
		//IL_13e4: Unknown result type (might be due to invalid IL or missing references)
		//IL_13e9: Unknown result type (might be due to invalid IL or missing references)
		//IL_1470: Unknown result type (might be due to invalid IL or missing references)
		//IL_1475: Unknown result type (might be due to invalid IL or missing references)
		//IL_1481: Unknown result type (might be due to invalid IL or missing references)
		//IL_1486: Unknown result type (might be due to invalid IL or missing references)
		//IL_1490: Unknown result type (might be due to invalid IL or missing references)
		//IL_1495: Unknown result type (might be due to invalid IL or missing references)
		//IL_149d: Unknown result type (might be due to invalid IL or missing references)
		//IL_14a6: Unknown result type (might be due to invalid IL or missing references)
		//IL_14b0: Unknown result type (might be due to invalid IL or missing references)
		//IL_14b7: Unknown result type (might be due to invalid IL or missing references)
		//IL_1460: Unknown result type (might be due to invalid IL or missing references)
		//IL_15b9: Unknown result type (might be due to invalid IL or missing references)
		//IL_15be: Unknown result type (might be due to invalid IL or missing references)
		ModelHardpoint[] array = UWModel.ExtractAllHardpoints(_007B2526_007D);
		Model = new ShipModelContent(GameLoader.Current.materialsDatabase, _007B2526_007D, _007B2527_007D);
		IsBalloon = _007B2524_007D.ModelName.Contains("Balloon");
		HasSteamWheel = Model.wheelSteamShip != null;
		_007B2562_007D = _007B2524_007D.PreinstalledBowFig;
		_007B2563_007D = (_007B2526_007D.Tag as UWModelTagCompiled).Tag.Scale;
		TriangleMeshShape triangleMeshShape = null;
		BoxShape boxShape = new BoxShape(_007B2524_007D.CorpusHitboxCenter * _007B2563_007D, _007B2524_007D.CorpusHitboxSize.Z * _007B2563_007D, _007B2524_007D.CorpusHitboxSize.Y * _007B2563_007D, _007B2524_007D.CorpusHitboxSize.X * _007B2563_007D);
		if (Model.hitboxModel != null)
		{
			triangleMeshShape = new TriangleMeshShape(Model.hitboxModel, 4f, 3f);
			FrontWaveCut = 0f;
			BackWaveCut = 0f;
			ShapeHelper.ClipPlane(triangleMeshShape, 0f, delegate(Vector3 _007B2557_007D)
			{
				//IL_0008: Unknown result type (might be due to invalid IL or missing references)
				//IL_001f: Unknown result type (might be due to invalid IL or missing references)
				FrontWaveCut = Math.Max(FrontWaveCut, _007B2557_007D.X);
				BackWaveCut = Math.Max(BackWaveCut, _007B2557_007D.X);
			});
			FrontWaveCut *= 0.3f;
			BackWaveCut *= 0.3f;
		}
		else
		{
			FrontWaveCut = boxShape.MaxP.X * 0.3f + 0.3f;
			BackWaveCut = boxShape.MinP.X * 0.3f - 0.3f;
			Debug.WriteLine("Model: " + Model.corpus.ModelName);
		}
		CorpusHitbox = new CorpusHitbox(boxShape, triangleMeshShape);
		CorpusHalfLength = CorpusShape.FinalLength * 0.3f * 0.5f;
		CorpusHalfWidth = CorpusShape.FinalWidth * 0.3f * 0.5f;
		CorpusHalfHeight = CorpusShape.FinalHeight * 0.3f * 0.5f;
		BSphere = BoundingSphere.CreateMerged(Model.DefaultElementsBS, CorpusShape.Sphere);
		BSRadius = BSphere.Radius * 0.3f;
		BSRadiusMax = (BSphere.Radius + ((Vector3)(ref BSphere.Center)).Length()) * 0.3f;
		_007B2534_007D();
		WaterlineOffset = _007B2524_007D.WaterlineOffset;
		if (array.Length == 0 && !IsBalloon && !_007B2524_007D.ModelName.Contains("Small"))
		{
			throw new InvalidOperationException();
		}
		DeckCoverModelInstances = new Tlist<DeckCoverModelInfo>();
		PaddleModelInstances = new Tlist<Matrix>();
		Tlist<ModelHardpoint> tlist = new Tlist<ModelHardpoint>();
		Tlist<ModelHardpoint> tlist2 = new Tlist<ModelHardpoint>();
		Tlist<ModelHardpoint> tlist3 = new Tlist<ModelHardpoint>();
		List<ModelHardpoint> list = new List<ModelHardpoint>();
		List<FalkonetLocationInfo> list2 = new List<FalkonetLocationInfo>();
		List<CannonLocationInfo> list3 = new List<CannonLocationInfo>();
		List<Vector3> list4 = new List<Vector3>();
		GunneryCrewPositions = new Tlist<(Vector3, float)>();
		Tlist<(Vector3, float)> tlist4 = new Tlist<(Vector3, float)>();
		SmallLights = new Tlist<Matrix>();
		Vector3 val = default(Vector3);
		Quaternion val2 = default(Quaternion);
		Vector3 val3 = default(Vector3);
		Vector3 val4 = default(Vector3);
		Quaternion val5 = default(Quaternion);
		Vector3 val6 = default(Vector3);
		Vector3 translation = default(Vector3);
		for (int num = 0; num < array.Length; num++)
		{
			ModelHardpoint item = array[num];
			if (item.HardpointID == WorldOfSeaBattleHardpointID.DeckOpenCover || item.HardpointID == WorldOfSeaBattleHardpointID.DeckHalfOpenCover)
			{
				Matrix transform = item.Transform;
				if (((Matrix)(ref transform)).Decompose(ref val, ref val2, ref val3))
				{
					if (val3.Z > 0f)
					{
						DeckCoverModelInstances.Add(new DeckCoverModelInfo(transform, item.HardpointID == WorldOfSeaBattleHardpointID.DeckOpenCover, null));
						Matrix _007B2598_007D = Matrix.CreateRotationY((float)Math.PI) * Matrix.CreateScale(1f, 1f, -1f) * transform * Matrix.CreateScale(1f, 1f, -1f);
						DeckCoverModelInstances.Add(new DeckCoverModelInfo(_007B2598_007D, item.HardpointID == WorldOfSeaBattleHardpointID.DeckOpenCover, null));
					}
					continue;
				}
				throw new InvalidOperationException();
			}
			if (item.HardpointID == WorldOfSeaBattleHardpointID.PaddleInstance)
			{
				Matrix item2 = item.Transform;
				if (((Matrix)(ref item2)).Decompose(ref val4, ref val5, ref val6))
				{
					if (val6.Z < 0f)
					{
						PaddleModelInstances.Add(in item2);
						val6.Z *= -1f;
						val5.W *= -1f;
						Matrix item3 = Matrix.CreateScale(val4) * Matrix.CreateWorld(val6, Vector3.Transform(-Vector3.Forward, val5), Vector3.Up);
						PaddleModelInstances.Add(in item3);
					}
					continue;
				}
				throw new InvalidOperationException();
			}
			if (item.HardpointID == WorldOfSeaBattleHardpointID.HPShipSmallLight)
			{
				SmallLights.Add(in item.Transform);
				continue;
			}
			WorldOfSeaBattleHardpointID hardpointID = item.HardpointID;
			if ((uint)hardpointID <= 1u)
			{
				tlist.Add(in item);
			}
			else if (item.HardpointID == WorldOfSeaBattleHardpointID.CannonTopPoint)
			{
				tlist2.Add(in item);
			}
			else if (item.HardpointID == WorldOfSeaBattleHardpointID.CannonBackPoint)
			{
				tlist3.Add(in item);
			}
			else if (item.HardpointID == WorldOfSeaBattleHardpointID.FireGun)
			{
				list.Add(item);
			}
			else if (item.HardpointID == WorldOfSeaBattleHardpointID.Falkonet)
			{
				list2.Add(new FalkonetLocationInfo(((Matrix)(ref item.Transform)).Translation));
			}
			else if (item.HardpointID == WorldOfSeaBattleHardpointID.Mortar || item.HardpointID == WorldOfSeaBattleHardpointID.ExtraMort)
			{
				Vector2 val7 = ExtensionMethods.Normal(new Vector2(item.Transform.M11, item.Transform.M21));
				list3.Add(new CannonLocationInfo(list3.Count, 0, 1f, ((Matrix)(ref item.Transform)).Translation, val7, (val7.X > 0f) ? CannonLocation.InFront : CannonLocation.InBack, this, _007B2274_007D: true, CannonLocationMode.Mortar, item.HardpointID == WorldOfSeaBattleHardpointID.ExtraMort));
			}
			else if (item.HardpointID == WorldOfSeaBattleHardpointID.BowFigurePlace)
			{
				BowFigurePosition = ((Matrix)(ref item.Transform)).Translation;
				BowFigurePosition.Z = 0f;
			}
			else if (item.HardpointID == WorldOfSeaBattleHardpointID.ShipUnit1)
			{
				GunneryCrewPositions.Add((((Matrix)(ref item.Transform)).Translation, MathF.Atan2(0f - item.Transform.M31, item.Transform.M11)));
			}
			else if (item.HardpointID >= WorldOfSeaBattleHardpointID.ShipUnit1 && item.HardpointID <= WorldOfSeaBattleHardpointID.ShipUnit8 && ((Matrix)(ref item.Transform)).Translation.Y < 17f)
			{
				translation = ((Matrix)(ref item.Transform)).Translation;
				if (((Vector3)(ref translation)).LengthSquared() > 0.1f)
				{
					tlist4.Add((((Matrix)(ref item.Transform)).Translation, MathF.Atan2(0f - item.Transform.M31, item.Transform.M11)));
				}
			}
		}
		tlist.SortTop((ModelHardpoint _007B2567_007D) => ((Matrix)(ref _007B2567_007D.Transform)).Translation.X);
		_007B2560_007D = new Vector2(float.MaxValue, float.MaxValue);
		_007B2561_007D = new Vector2(float.MinValue, float.MinValue);
		foreach (FalkonetLocationInfo item7 in list2)
		{
			_007B2560_007D = Vector2.Min(_007B2560_007D, item7.LocalPosition.XZ());
			_007B2561_007D = Vector2.Max(_007B2561_007D, item7.LocalPosition.XZ());
		}
		FalkonetPositions = list2.ToArray();
		MortarPorts = list3.ToArray();
		int num2 = 1;
		LeftSidePorts = new CannonLocationInfo[tlist.Size];
		RightSidePorts = new CannonLocationInfo[tlist.Size];
		FrontSidePorts = new CannonLocationInfo[tlist2.Size + list.Count];
		BackSidePorts = new CannonLocationInfo[tlist3.Size];
		float num3 = 0.01f;
		Vector3 val8 = default(Vector3);
		Quaternion val9 = default(Quaternion);
		for (int num4 = 0; num4 < tlist.Size; num4++)
		{
			LeftSidePorts[num4] = new CannonLocationInfo(num2++, num4, ((Matrix)(ref tlist[num4].Transform)).Decompose(ref val8, ref val9, ref translation) ? (val8.X * num3) : 1f, ((Matrix)(ref tlist[num4].Transform)).Translation, new Vector2(0f, (float)Math.PI), CannonLocation.RightSide, this, tlist[num4].HardpointID != WorldOfSeaBattleHardpointID.CannonNoLafetSidePoint, CannonLocationMode.Default);
		}
		Vector3 val10 = default(Vector3);
		for (int num5 = 0; num5 < tlist.Size; num5++)
		{
			RightSidePorts[num5] = new CannonLocationInfo(num2++, num5, ((Matrix)(ref tlist[num5].Transform)).Decompose(ref val10, ref val9, ref translation) ? (val10.X * num3) : 1f, ((Matrix)(ref tlist[num5].Transform)).Translation * new Vector3(1f, 1f, -1f), new Vector2(0f, 0f), CannonLocation.LeftSide, this, tlist[num5].HardpointID != WorldOfSeaBattleHardpointID.CannonNoLafetSidePoint, CannonLocationMode.Default);
		}
		Vector3 val11 = default(Vector3);
		for (int num6 = 0; num6 < tlist2.Size; num6++)
		{
			FrontSidePorts[num6] = new CannonLocationInfo(num2++, 0, ((Matrix)(ref tlist2[num6].Transform)).Decompose(ref val11, ref val9, ref translation) ? (val11.X * num3) : 1f, ((Matrix)(ref tlist2[num6].Transform)).Translation, new Vector2(0f, -(float)Math.PI / 2f), CannonLocation.InFront, this, tlist2[num6].HardpointID != WorldOfSeaBattleHardpointID.CannonNoLafetSidePoint, CannonLocationMode.Default);
		}
		Vector3 val12 = default(Vector3);
		for (int num7 = 0; num7 < tlist3.Size; num7++)
		{
			BackSidePorts[num7] = new CannonLocationInfo(num2++, 0, ((Matrix)(ref tlist3[num7].Transform)).Decompose(ref val12, ref val9, ref translation) ? (val12.X * num3) : 1f, ((Matrix)(ref tlist3[num7].Transform)).Translation, new Vector2(0f, (float)Math.PI / 2f), CannonLocation.InBack, this, tlist3[num7].HardpointID != WorldOfSeaBattleHardpointID.CannonNoLafetSidePoint, CannonLocationMode.Default);
		}
		for (int num8 = 0; num8 < list.Count; num8++)
		{
			FrontSidePorts[num8 + tlist2.Size] = new CannonLocationInfo(num2++, 0, 1f, ((Matrix)(ref list[num8].Transform)).Translation, new Vector2(0f, -(float)Math.PI / 2f), CannonLocation.InFront, this, _007B2274_007D: true, CannonLocationMode.Special);
		}
		SpecialCannonsCount = list.Count;
		MiddleCannonsHeight = ((LeftSidePorts.Length == 0) ? 0f : (LeftSidePorts.Average((CannonLocationInfo _007B2568_007D) => _007B2568_007D.Position.Y) * 0.3f));
		LeftCannonsBindCamera = ((LeftSidePorts.Length == 0) ? 0f : (LeftSidePorts.Concat(LeftSidePorts).Max((CannonLocationInfo _007B2569_007D) => _007B2569_007D.Position.Y) * 0.3f));
		RearCannonsBindCamera = ((FrontSidePorts.Length == 0) ? LeftCannonsBindCamera : (FrontSidePorts.Max((CannonLocationInfo _007B2570_007D) => _007B2570_007D.Position.Y) * 0.3f));
		BackCannonsBindCamera = ((BackSidePorts.Length == 0) ? LeftCannonsBindCamera : (BackSidePorts.Max((CannonLocationInfo _007B2571_007D) => _007B2571_007D.Position.Y) * 0.3f));
		BackCannonsBindCamera = Math.Max(LeftCannonsBindCamera, BackCannonsBindCamera);
		CannonMax = new Vector2(float.MinValue);
		CannonMin = new Vector2(float.MaxValue);
		CannonLocationInfo[][] array2 = new CannonLocationInfo[2][] { LeftSidePorts, RightSidePorts };
		foreach (CannonLocationInfo[] array3 in array2)
		{
			CannonLocationInfo[] array4 = array3;
			foreach (CannonLocationInfo cannonLocationInfo in array4)
			{
				CannonMax = Vector2.Max(CannonMax, new Vector2(cannonLocationInfo.Position.X, cannonLocationInfo.Position.Z));
				CannonMin = Vector2.Min(CannonMin, new Vector2(cannonLocationInfo.Position.X, cannonLocationInfo.Position.Z));
			}
		}
		if (LeftSidePorts.Length == 0)
		{
			CannonMax = _007B2561_007D;
			CannonMin = _007B2560_007D;
		}
		CannonMin *= 0.3f;
		CannonMax *= 0.3f;
		Tlist<CannonLocationInfo> tlist5 = new Tlist<CannonLocationInfo>(LeftSidePorts.Concat(RightSidePorts).Concat(FrontSidePorts).Concat(BackSidePorts));
		tlist5.SortTop((CannonLocationInfo _007B2572_007D) => -_007B2572_007D.SectionID);
		Ports = tlist5.ToArray();
		foreach (DeckCoverModelInfo item8 in (IEnumerable<DeckCoverModelInfo>)DeckCoverModelInstances)
		{
			CannonLocationInfo cannonLocationInfo2 = tlist5.FindNear(((Matrix)(ref item8.World)).Translation, (CannonLocationInfo _007B2573_007D) => _007B2573_007D.Position);
			item8.NearSectionId = cannonLocationInfo2.SectionID;
		}
		Tlist<int> tlist6 = new Tlist<int>();
		for (int item4 = 0; item4 < LeftSidePorts.Length; item4++)
		{
			tlist6.Add(in item4);
		}
		Decks = new Tlist<Tlist<CannonLocationInfo>>();
		Vector2 _007B2536_007D = default(Vector2);
		while (tlist6.Size != 0)
		{
			Tlist<CannonLocationInfo> item5 = new Tlist<CannonLocationInfo>();
			int item6 = tlist6.Array[0];
			((Vector2)(ref _007B2536_007D))._002Ector(-1f, 0f);
			while (item6 != -1)
			{
				item5.Add(in LeftSidePorts[item6]);
				item5.Add(in RightSidePorts[item6]);
				tlist6.RemoveAt(tlist6.IndexOf(in item6));
				item6 = findNext(item6, ref _007B2536_007D, tlist6);
			}
			Decks.Add(in item5);
		}
		Decks.SortTop((Tlist<CannonLocationInfo> _007B2574_007D) => _007B2574_007D.First().Position.Y);
		for (int num11 = 0; num11 < Decks.Size; num11++)
		{
			foreach (CannonLocationInfo item9 in (IEnumerable<CannonLocationInfo>)Decks[num11])
			{
				item9.DeckIndex = num11;
			}
		}
		AnimatedSailesBits.Value = 0;
		for (int num12 = 0; num12 < SailHitboxes.Length; num12++)
		{
			if (SailHitboxes[num12].IsSailAnimated)
			{
				AnimatedSailesBits[SailHitboxes[num12].SailStrengthIndex] = true;
			}
		}
		CannonLocationInfo extraMortar = MortarPorts.FirstOrDefault((CannonLocationInfo _007B2575_007D) => _007B2575_007D.AvailableWithUpgrade);
		if (extraMortar != null)
		{
			SailHitbox sailHitbox = null;
			SailHitbox[] sailHitboxes = SailHitboxes;
			foreach (SailHitbox sailHitbox2 in sailHitboxes)
			{
				if (sailHitbox2.IsSailAnimated)
				{
					float num14 = Vector3.DistanceSquared(sailHitbox2.VisualPosition, extraMortar.Position + extraMortar.Normal * 12f);
					float num15 = ((sailHitbox == null) ? float.MaxValue : Vector3.DistanceSquared(sailHitbox.VisualPosition, extraMortar.Position));
					if (num14 < num15)
					{
						sailHitbox = sailHitbox2;
					}
				}
			}
			SailRemovedWithMortar = sailHitbox;
			Tlist<CannonLocationInfo> tlist7 = new Tlist<CannonLocationInfo>(LeftSidePorts);
			tlist7.SortTop((CannonLocationInfo _007B2579_007D) => 0f - Vector3.DistanceSquared(extraMortar.Position, _007B2579_007D.Position));
			for (int num16 = 0; num16 < tlist7.Size; num16++)
			{
				tlist7.Array[num16].ReduceCannonsOrder = num16;
			}
			for (int num17 = 0; num17 < LeftSidePorts.Length; num17++)
			{
				RightSidePorts[num17].ReduceCannonsOrder = LeftSidePorts[num17].ReduceCannonsOrder;
			}
		}
		HasUniqueWindRose = base.ID == 13 || base.ID == 25 || base.ID == 41 || base.ID == 54 || base.ID == 56 || base.ID == 5 || base.ID == 63;
		Weight = _007B2524_007D.Weight * 1000f;
		int num18 = 30000;
		int num19 = 80000;
		InertionFactor = 2f - Geometry.Saturate((Weight - (float)num18) / (float)(num19 - num18));
		if (base.ID == 56)
		{
			InertionFactor = 1.6f;
		}
		HardnessFactor = 2f - InertionFactor;
		CrewPositions = new Tlist<(Vector3, float)>(tlist4);
		CrewPositions.Shuffle(new Sequence(base.ID));
		if (CrewPositions.Size > 0)
		{
			MaxCrewPosition = CrewPositions.Array[0].Item1;
			MinCrewPosition = CrewPositions.Array[0].Item1;
			for (int num20 = 1; num20 < CrewPositions.Size; num20++)
			{
				MaxCrewPosition = Vector3.Max(MaxCrewPosition, CrewPositions.Array[num20].Item1);
				MinCrewPosition = Vector3.Min(MinCrewPosition, CrewPositions.Array[num20].Item1);
			}
		}
		CrewPositions_Double = new Tlist<(Vector3, float)>(CrewPositions);
		for (int num21 = 0; num21 < CrewPositions.Size; num21++)
		{
			(Vector3, float) tuple = CrewPositions.Array[num21];
			(Vector3, float)? tuple2 = NearCrewPlaceHelper(tuple.Item1, num21 + 1, _007B2531_007D: false);
			if (!tuple2.HasValue)
			{
				tuple2 = NearCrewPlaceHelper(tuple.Item1, 0, _007B2531_007D: true);
			}
			Vector2 val13 = Vector2.Lerp(tuple.Item1.XZ(), tuple2.Value.Item1.XZ(), 0.5f);
			CrewPositions_Double.Add(in ILSpyHelper_AsRefReadOnly((new Vector3(val13.X, tuple.Item1.Y, val13.Y), tuple.Item2 + HashHelper.greater(num21) * 0.4f - 0.2f)));
		}
		CrewPositions_Double.Trim();
		if (tlist4.Size == 0 && tlist.Size > 4)
		{
			GameLoader.Current.AddImportant("Ship " + Model.corpus.ModelName + " doesn't have crew position");
		}
		if (list2.Count == 0 && !_007B2524_007D.ModelName.Contains("Ship_2_") && !_007B2524_007D.ModelName.Contains("Balloon"))
		{
			GameLoader.Current.AddImportant("Ship " + Model.corpus.ModelName + " doesn't have Falkonets");
		}
		if (BowFigurePosition == Vector3.Zero && !_007B2524_007D.ModelName.Contains("Ship_2_") && !IsBalloon)
		{
			GameLoader.Current.AddImportant("Ship " + Model.corpus.ModelName + " doesn't have BowFigurePosition");
		}
		foreach (UWModel item10 in Model.sailesAnimated.Concat(Model.sailesStatic))
		{
			if (item10.Drawcalls.Length > 1)
			{
				GameLoader.Current.AddImportant("Ship " + _007B2524_007D.ModelName + " has sail with 2 or more drawcalls " + item10.MeshName);
			}
		}
		static ref readonly T ILSpyHelper_AsRefReadOnly<T>(in T temp)
		{
			//ILSpy generated this function to help ensure overload resolution can pick the overload using 'in'
			return ref temp;
		}
	}

	internal void FinalInit()
	{
		if (!string.IsNullOrEmpty(_007B2562_007D))
		{
			PreinstalledBowFigure = Gameplay.DesignsInfo.FirstOrDefault((ShipDesignInfo _007B2559_007D) => _007B2559_007D.nameKey == _007B2562_007D);
			if (PreinstalledBowFigure == null)
			{
				GameLoader.Current.AddImportant("Ship " + Model.corpus.ModelName + " has wrong Preinstalled bow figure id");
			}
		}
	}

	private void _007B2528_007D()
	{
		Tlist<IShipHitbox> tlist = new Tlist<IShipHitbox>();
		IShipHitbox item = CorpusHitbox;
		tlist.Add(in item);
		HitboxTableByNodeID = tlist;
		for (int i = 0; i < SailHitboxes.Length; i++)
		{
			Tlist<IShipHitbox> hitboxTableByNodeID = HitboxTableByNodeID;
			item = SailHitboxes[i];
			hitboxTableByNodeID.Add(in item);
		}
		for (int j = 0; j < MastHitboxes.Length; j++)
		{
			Tlist<IShipHitbox> hitboxTableByNodeID2 = HitboxTableByNodeID;
			item = MastHitboxes[j];
			hitboxTableByNodeID2.Add(in item);
		}
		if (HitboxTableByNodeID.Size >= 255)
		{
			throw new NotSupportedException();
		}
		for (int k = 0; k < HitboxTableByNodeID.Size; k++)
		{
			HitboxTableByNodeID.Array[k].NodeID = (byte)k;
		}
	}

	private (Vector3, float)? NearCrewPlaceHelper(Vector3 _007B2529_007D, int _007B2530_007D, bool _007B2531_007D)
	{
		//IL_0044: Unknown result type (might be due to invalid IL or missing references)
		//IL_0049: Unknown result type (might be due to invalid IL or missing references)
		//IL_004e: Unknown result type (might be due to invalid IL or missing references)
		//IL_004f: Unknown result type (might be due to invalid IL or missing references)
		//IL_007b: Unknown result type (might be due to invalid IL or missing references)
		float num = float.MaxValue;
		(Vector3, float) tuple = CrewPositions.Array[0];
		(Vector3, float) tuple2 = CrewPositions.Array[0];
		for (int i = _007B2530_007D; i < CrewPositions.Size; i++)
		{
			float num2 = Vector2.DistanceSquared(CrewPositions.Array[i].Item1.XZ(), _007B2529_007D.XZ());
			if (num2 < num && Math.Abs(CrewPositions.Array[i].Item1.Y - _007B2529_007D.Y) < 0.5f)
			{
				num = num2;
				tuple2 = tuple;
				tuple = CrewPositions.Array[i];
			}
		}
		if (num == float.MaxValue)
		{
			return null;
		}
		return _007B2531_007D ? tuple2 : tuple;
	}

	private UWModel _007B2532_007D(UWModel _007B2533_007D)
	{
		//IL_002d: Unknown result type (might be due to invalid IL or missing references)
		if (Model.sailesRolledAll.Size == 0)
		{
			return null;
		}
		return Model.sailesRolledAll.FindNear(_007B2533_007D.CommonSphere.Center, (UWModel _007B2576_007D) => _007B2576_007D.CommonSphere.Center);
	}

	private void _007B2534_007D()
	{
		//IL_004b: Unknown result type (might be due to invalid IL or missing references)
		//IL_00c8: Unknown result type (might be due to invalid IL or missing references)
		//IL_0143: Unknown result type (might be due to invalid IL or missing references)
		//IL_0148: Unknown result type (might be due to invalid IL or missing references)
		//IL_014d: Unknown result type (might be due to invalid IL or missing references)
		//IL_01eb: Unknown result type (might be due to invalid IL or missing references)
		//IL_01f0: Unknown result type (might be due to invalid IL or missing references)
		//IL_020b: Unknown result type (might be due to invalid IL or missing references)
		//IL_020d: Unknown result type (might be due to invalid IL or missing references)
		//IL_0219: Unknown result type (might be due to invalid IL or missing references)
		//IL_021e: Unknown result type (might be due to invalid IL or missing references)
		//IL_0223: Unknown result type (might be due to invalid IL or missing references)
		//IL_022a: Unknown result type (might be due to invalid IL or missing references)
		//IL_022c: Unknown result type (might be due to invalid IL or missing references)
		//IL_0238: Unknown result type (might be due to invalid IL or missing references)
		//IL_023d: Unknown result type (might be due to invalid IL or missing references)
		//IL_0242: Unknown result type (might be due to invalid IL or missing references)
		//IL_02d5: Unknown result type (might be due to invalid IL or missing references)
		//IL_02eb: Unknown result type (might be due to invalid IL or missing references)
		//IL_02ed: Unknown result type (might be due to invalid IL or missing references)
		//IL_02f7: Unknown result type (might be due to invalid IL or missing references)
		//IL_02f9: Unknown result type (might be due to invalid IL or missing references)
		//IL_030a: Unknown result type (might be due to invalid IL or missing references)
		//IL_030c: Unknown result type (might be due to invalid IL or missing references)
		//IL_0326: Unknown result type (might be due to invalid IL or missing references)
		//IL_0387: Unknown result type (might be due to invalid IL or missing references)
		//IL_027c: Unknown result type (might be due to invalid IL or missing references)
		//IL_0286: Unknown result type (might be due to invalid IL or missing references)
		//IL_0288: Unknown result type (might be due to invalid IL or missing references)
		//IL_0409: Unknown result type (might be due to invalid IL or missing references)
		SailHitboxes = new SailHitbox[Model.sailesStatic.Size + Model.sailesAnimated.Size];
		for (int i = 0; i < Model.sailesStatic.Size; i++)
		{
			UWModel uWModel = Model.sailesStatic.Array[i];
			BoxShape _007B113_007D;
			BoxShape[] _007B2494_007D = ShapeHelper.Levels(CorpusShape.MaxP.Y - 1f, 4, 1, uWModel, 0.94f, out _007B113_007D);
			SailHitboxes[i] = new SailHitbox(uWModel, _007B2532_007D(uWModel), _007B2493_007D: false, _007B2494_007D, _007B113_007D);
		}
		for (int j = 0; j < Model.sailesAnimated.Size; j++)
		{
			UWModel uWModel2 = Model.sailesAnimated.Array[j];
			BoxShape _007B113_007D2;
			BoxShape[] _007B2494_007D2 = ShapeHelper.Levels(CorpusShape.MaxP.Y - 1f, 4, 1, uWModel2, 0.94f, out _007B113_007D2);
			SailHitboxes[Model.sailesStatic.Size + j] = new SailHitbox(uWModel2, _007B2532_007D(uWModel2), _007B2493_007D: true, _007B2494_007D2, _007B113_007D2);
			SailHitboxes[Model.sailesStatic.Size + j].ModelSpaceRotationPivot = ((AnimatedModelTag)uWModel2.Tag).Pivot.Average.XZ();
		}
		for (int k = 0; k < SailHitboxes.Length; k++)
		{
			SailHitboxes[k].SailStrengthIndex = k;
		}
		Tlist<SailHitbox> tlist = new Tlist<SailHitbox>();
		MastHitboxes = new MastHitbox[Model.mastsApart.Size];
		for (int l = 0; l < Model.mastsApart.Size; l++)
		{
			UWModel uWModel3 = Model.mastsApart.Array[l];
			BoundingBox localSpaceBoundingBox = uWModel3.MeshParts[0].LocalSpaceBoundingBox;
			MeshPartData[] meshParts = uWModel3.MeshParts;
			foreach (MeshPartData meshPartData in meshParts)
			{
				localSpaceBoundingBox.Min = Vector3.Min(localSpaceBoundingBox.Min, meshPartData.LocalSpaceBoundingBox.Min);
				localSpaceBoundingBox.Max = Vector3.Max(localSpaceBoundingBox.Max, meshPartData.LocalSpaceBoundingBox.Max);
			}
			for (int n = 0; n < SailHitboxes.Length; n++)
			{
				SailHitbox item = SailHitboxes[n];
				if (item.IsSailAnimated && Math.Abs(item.CommonShape.MinP.X - localSpaceBoundingBox.Min.X) < 2f)
				{
					tlist.Add(in item);
				}
			}
			localSpaceBoundingBox.Min.Y = CorpusShape.MaxP.Y;
			localSpaceBoundingBox.Max.Y = (localSpaceBoundingBox.Max.Y - localSpaceBoundingBox.Min.Y) * 0.55f + localSpaceBoundingBox.Min.Y;
			MastHitboxes[l] = new MastHitbox(uWModel3, localSpaceBoundingBox, tlist.ToArray());
		}
		_007B2528_007D();
		float num = 0f;
		for (int num2 = 0; num2 < SailHitboxes.Length; num2++)
		{
			for (int num3 = 0; num3 < 4; num3++)
			{
				BoxShape boxShape = SailHitboxes[num2].Shape[num3];
				num += boxShape.Sphere.Radius;
			}
		}
		if (num == 0f && SailHitboxes.Length != 0)
		{
			throw new Exception();
		}
		for (int num4 = 0; num4 < SailHitboxes.Length; num4++)
		{
			float num5 = 0f;
			for (int num6 = 0; num6 < 4; num6++)
			{
				BoxShape boxShape2 = SailHitboxes[num4].Shape[num6];
				num5 += boxShape2.Sphere.Radius;
			}
			SailHitboxes[num4].Weight = num5 / num;
			SailHitboxes[num4].WeigthMul = num5 / num * (float)SailHitboxes.Length;
		}
	}

	private int findNext(int _007B2535_007D, ref Vector2 _007B2536_007D, Tlist<int> _007B2537_007D)
	{
		//IL_0009: Unknown result type (might be due to invalid IL or missing references)
		//IL_000e: Unknown result type (might be due to invalid IL or missing references)
		//IL_0013: Unknown result type (might be due to invalid IL or missing references)
		//IL_0035: Unknown result type (might be due to invalid IL or missing references)
		//IL_003a: Unknown result type (might be due to invalid IL or missing references)
		//IL_003f: Unknown result type (might be due to invalid IL or missing references)
		//IL_0040: Unknown result type (might be due to invalid IL or missing references)
		//IL_0045: Unknown result type (might be due to invalid IL or missing references)
		//IL_0058: Unknown result type (might be due to invalid IL or missing references)
		//IL_005b: Unknown result type (might be due to invalid IL or missing references)
		//IL_008b: Unknown result type (might be due to invalid IL or missing references)
		//IL_008d: Unknown result type (might be due to invalid IL or missing references)
		Vector2 val = LeftSidePorts[_007B2535_007D].Position.XY();
		Tlist<ContactData> tlist = new Tlist<ContactData>(25);
		for (int i = 0; i < _007B2537_007D.Size; i++)
		{
			CannonLocationInfo cannonLocationInfo = LeftSidePorts[_007B2537_007D.Array[i]];
			Vector2 val2 = cannonLocationInfo.Position.XY() - val;
			float distance = ((Vector2)(ref val2)).Length();
			((Vector2)(ref val2)).Normalize();
			float num = Vector2.Dot(val2, _007B2536_007D);
			if (num > 0.96f)
			{
				ContactData item = new ContactData
				{
					DotProduct = num,
					DVector = val2,
					With = cannonLocationInfo,
					WithIndex = _007B2537_007D.Array[i],
					Distance = distance
				};
				tlist.Add(in item);
			}
		}
		if (tlist.Size != 0)
		{
			tlist.SortTop((ContactData _007B2577_007D) => 0f - _007B2577_007D.Distance);
			ContactData contactData = tlist.Array[0];
			return contactData.WithIndex;
		}
		return -1;
	}

	private Vector3[] _007B2538_007D(Vector3[] _007B2539_007D, Vector3 _007B2540_007D)
	{
		int num = _007B2539_007D.Length;
		for (int i = 0; i < num; i++)
		{
			Vector3.Multiply(ref _007B2539_007D[i], ref _007B2540_007D, ref _007B2539_007D[i]);
		}
		return _007B2539_007D;
	}

	internal CannonLocationInfo GetCannonPosFromSectionID(short _007B2541_007D)
	{
		return Ports[_007B2541_007D - 1];
	}

	internal CannonLocationInfo TryGetCannonPosFromSectionID(short _007B2542_007D)
	{
		if (_007B2542_007D >= 1 && _007B2542_007D <= Ports.Length)
		{
			return Ports[_007B2542_007D - 1];
		}
		return null;
	}

	[IteratorStateMachine(typeof(_003CFetchMortars_003Ed__69))]
	public IEnumerable<(CannonLocationInfo location, CannonGameInfo mortar)> FetchMortars(bool _007B2543_007D, ShipDynamicInfo _007B2544_007D)
	{
		//yield-return decompiler failed: Method not found
		return new _003CFetchMortars_003Ed__69(-2)
		{
			_003C_003E4__this = this,
			_003C_003E3__isFront = _007B2543_007D,
			_003C_003E3__src = _007B2544_007D
		};
	}

	public int CountActiveFalkonet(Ship _007B2545_007D, in Vector3 _007B2546_007D)
	{
		//IL_000d: Unknown result type (might be due to invalid IL or missing references)
		//IL_0012: Unknown result type (might be due to invalid IL or missing references)
		//IL_0018: Unknown result type (might be due to invalid IL or missing references)
		int num = FalkonetPositions.Length / 2;
		if (Math.Abs(Vector2.Dot(_007B2546_007D.XZNormal(), _007B2545_007D.FastNormal)) > 0.979f)
		{
			num = Math.Min(num, 2);
		}
		return num;
	}

	public Tlist<FalkonetShotInfoRemote> FetchActiveFalkonet(Ship _007B2547_007D, CannonBallInfo _007B2548_007D, in Vector3 _007B2549_007D, float _007B2550_007D)
	{
		//IL_0002: Unknown result type (might be due to invalid IL or missing references)
		//IL_0008: Unknown result type (might be due to invalid IL or missing references)
		//IL_000f: Unknown result type (might be due to invalid IL or missing references)
		//IL_0023: Unknown result type (might be due to invalid IL or missing references)
		//IL_0028: Unknown result type (might be due to invalid IL or missing references)
		//IL_002d: Unknown result type (might be due to invalid IL or missing references)
		//IL_0032: Unknown result type (might be due to invalid IL or missing references)
		//IL_00ea: Unknown result type (might be due to invalid IL or missing references)
		//IL_0085: Unknown result type (might be due to invalid IL or missing references)
		//IL_008a: Unknown result type (might be due to invalid IL or missing references)
		//IL_008c: Unknown result type (might be due to invalid IL or missing references)
		//IL_00b5: Unknown result type (might be due to invalid IL or missing references)
		//IL_013e: Unknown result type (might be due to invalid IL or missing references)
		//IL_0143: Unknown result type (might be due to invalid IL or missing references)
		//IL_0144: Unknown result type (might be due to invalid IL or missing references)
		//IL_0149: Unknown result type (might be due to invalid IL or missing references)
		//IL_016d: Unknown result type (might be due to invalid IL or missing references)
		//IL_0172: Unknown result type (might be due to invalid IL or missing references)
		//IL_017e: Unknown result type (might be due to invalid IL or missing references)
		//IL_0183: Unknown result type (might be due to invalid IL or missing references)
		//IL_0190: Unknown result type (might be due to invalid IL or missing references)
		//IL_0197: Unknown result type (might be due to invalid IL or missing references)
		//IL_015d: Unknown result type (might be due to invalid IL or missing references)
		//IL_015e: Unknown result type (might be due to invalid IL or missing references)
		//IL_0160: Unknown result type (might be due to invalid IL or missing references)
		//IL_0165: Unknown result type (might be due to invalid IL or missing references)
		Vector3 val = _007B2547_007D.Position3D + _007B2549_007D * _007B2550_007D * new Vector3(1f, 0f, 1f);
		Tlist<FalkonetShotInfoRemote> tlist = new Tlist<FalkonetShotInfoRemote>();
		int num = CountActiveFalkonet(_007B2547_007D, in _007B2549_007D);
		_007B2547_007D.transform.CreateWorldMatrix(out var _007B14801_007D);
		Matrix val2 = default(Matrix);
		Matrix.Invert(ref _007B14801_007D, ref val2);
		Vector3 val3 = default(Vector3);
		Vector3.Transform(ref val, ref val2, ref val3);
		int num2 = ((!_007B2548_007D.IsBoardingHook || num < 6) ? 1 : 2);
		for (int i = 0; i < FalkonetPositions.Length; i++)
		{
			if (!((num > 2 || Math.Abs(Vector2.Dot(Vector2.UnitX, val3.XZNormal())) < 0.707f) ? (Math.Sign(val3.Z) != Math.Sign(FalkonetPositions[i].LocalPosition.Z)) : (Math.Abs(FalkonetPositions[i].LocalPosition.X - ((val3.X < 0f) ? _007B2560_007D.X : _007B2561_007D.X)) > 0.5f)) && tlist.Size % num2 != 1)
			{
				Vector3 val4 = Vector3.Transform(FalkonetPositions[i].LocalPosition, _007B14801_007D);
				Vector3 val5 = ((_007B2548_007D.IsBoardingHook || _007B2548_007D.ID == 18) ? _007B2549_007D : (val - val4).Normal());
				tlist.Add(new FalkonetShotInfoRemote(FalkonetPositions[i].LocalPosition, new Vector3(val5.X, _007B2549_007D.Y, val5.Z), 0, (byte)_007B2548_007D.ID, 0));
			}
		}
		tlist.Size = Math.Min(tlist.Size, num);
		tlist.SortTop((FalkonetShotInfoRemote _007B2578_007D) => _007B2578_007D.StartPosition.X);
		return tlist;
	}

	public Vector3 ProjectHitPosition(Ship _007B2551_007D, Vector3 _007B2552_007D, Vector3? _007B2553_007D)
	{
		//IL_001f: Unknown result type (might be due to invalid IL or missing references)
		//IL_0020: Unknown result type (might be due to invalid IL or missing references)
		//IL_003e: Unknown result type (might be due to invalid IL or missing references)
		//IL_0043: Unknown result type (might be due to invalid IL or missing references)
		//IL_0115: Unknown result type (might be due to invalid IL or missing references)
		//IL_00a3: Unknown result type (might be due to invalid IL or missing references)
		//IL_00a6: Unknown result type (might be due to invalid IL or missing references)
		//IL_00ac: Unknown result type (might be due to invalid IL or missing references)
		//IL_00b1: Unknown result type (might be due to invalid IL or missing references)
		//IL_00b6: Unknown result type (might be due to invalid IL or missing references)
		//IL_00b9: Unknown result type (might be due to invalid IL or missing references)
		//IL_00bf: Unknown result type (might be due to invalid IL or missing references)
		//IL_00c4: Unknown result type (might be due to invalid IL or missing references)
		//IL_0086: Unknown result type (might be due to invalid IL or missing references)
		//IL_0093: Unknown result type (might be due to invalid IL or missing references)
		//IL_0110: Unknown result type (might be due to invalid IL or missing references)
		//IL_0111: Unknown result type (might be due to invalid IL or missing references)
		//IL_0107: Unknown result type (might be due to invalid IL or missing references)
		//IL_010c: Unknown result type (might be due to invalid IL or missing references)
		if (_007B2551_007D.UsedShip.StaticInfo.CorpusHitbox.Hitmesh == null)
		{
			return _007B2552_007D;
		}
		Matrix _007B14801_007D;
		if (_007B2551_007D.LastWorld.HasValue)
		{
			_007B14801_007D = _007B2551_007D.LastWorld.Value;
		}
		else
		{
			_007B2551_007D.transform.CreateWorldMatrix(out _007B14801_007D);
		}
		Matrix _007B73_007D = default(Matrix);
		Matrix.Invert(ref _007B14801_007D, ref _007B73_007D);
		Vector3 val = default(Vector3);
		Vector3.Transform(ref _007B2552_007D, ref _007B73_007D, ref val);
		if (!_007B2553_007D.HasValue)
		{
			_007B2553_007D = new Vector3(0f, 0f, (float)(-Math.Sign(val.Z)));
		}
		float num = 0.8f;
		LineShape _007B70_007D = new LineShape(_007B2552_007D - _007B2553_007D.Value * num, _007B2552_007D + _007B2553_007D.Value * num, 0.1f);
		CollisionCore.RayWithMesh(_007B70_007D, _007B2551_007D.UsedShip.StaticInfo.CorpusHitbox.Hitmesh, ref _007B14801_007D, ref _007B73_007D, out var _007B74_007D);
		if (_007B74_007D.IsCollide)
		{
			return _007B74_007D.CollideCentr;
		}
		return _007B2552_007D;
	}

	public SailHitbox TrySailByNodeId(int _007B2554_007D)
	{
		IShipHitbox shipHitbox = HitboxTableByNodeID.Array[_007B2554_007D];
		return (SailHitbox)shipHitbox;
	}

	public SailHitbox SailByStr(int _007B2555_007D)
	{
		if (_007B2555_007D >= SailHitboxes.Length || _007B2555_007D < 0)
		{
			throw new InvalidOperationException("Out of bound access SailByStr, input index: " + _007B2555_007D + ", SailHitboxes.Length: " + SailHitboxes.Length + ", ship staticID: " + base.ID);
		}
		return SailHitboxes[_007B2555_007D];
	}

	public override string ToString()
	{
		return $"{base.ID}: {Model.corpus.ModelName}";
	}

	[CompilerGenerated]
	private void _007B2556_007D(Vector3 _007B2557_007D)
	{
		//IL_0008: Unknown result type (might be due to invalid IL or missing references)
		//IL_001f: Unknown result type (might be due to invalid IL or missing references)
		FrontWaveCut = Math.Max(FrontWaveCut, _007B2557_007D.X);
		BackWaveCut = Math.Max(BackWaveCut, _007B2557_007D.X);
	}

	[CompilerGenerated]
	private bool _007B2558_007D(ShipDesignInfo _007B2559_007D)
	{
		return _007B2559_007D.nameKey == _007B2562_007D;
	}
}
