using ManualPacketSerialization.Externs;

namespace ManualPacketSerialization.Database;

public class HeaderDataMaxID : ITKSerializable
{
	public uint MaxID;

	public HeaderDataMaxID()
	{
	}

	public HeaderDataMaxID(uint _007B11085_007D)
	{
		MaxID = _007B11085_007D;
	}

	private void _007B11086_007D(TKWriterExtern _007B11087_007D)
	{
		_007B11087_007D.WriteStruct(1, in MaxID);
	}

	void ITKSerializable.Boxing(TKWriterExtern _007B11087_007D)
	{
		//ILSpy generated this explicit interface implementation from .override directive in {11086}
		this._007B11086_007D(_007B11087_007D);
	}

	private void _007B11088_007D()
	{
	}

	void ITKSerializable.PreInit()
	{
		//ILSpy generated this explicit interface implementation from .override directive in {11088}
		this._007B11088_007D();
	}

	private void _007B11089_007D()
	{
	}

	void ITKSerializable.PostInit()
	{
		//ILSpy generated this explicit interface implementation from .override directive in {11089}
		this._007B11089_007D();
	}

	private void _007B11090_007D(short _007B11091_007D, WriterExtern _007B11092_007D, out bool _007B11093_007D)
	{
		_007B11093_007D = _007B11091_007D == 1;
		if (_007B11091_007D == 1)
		{
			_007B11092_007D.ReadStruct<uint>(out MaxID);
		}
	}

	void ITKSerializable.Load(short _007B11091_007D, WriterExtern _007B11092_007D, out bool _007B11093_007D)
	{
		//ILSpy generated this explicit interface implementation from .override directive in {11090}
		this._007B11090_007D(_007B11091_007D, _007B11092_007D, out _007B11093_007D);
	}
}
