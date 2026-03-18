using ManualPacketSerialization.Externs;

namespace ManualPacketSerialization.Database;

public class HeaderDataEmpty : ITKSerializable
{
	private void _007B11076_007D(TKWriterExtern _007B11077_007D)
	{
	}

	void ITKSerializable.Boxing(TKWriterExtern _007B11077_007D)
	{
		//ILSpy generated this explicit interface implementation from .override directive in {11076}
		this._007B11076_007D(_007B11077_007D);
	}

	private void _007B11078_007D()
	{
	}

	void ITKSerializable.PreInit()
	{
		//ILSpy generated this explicit interface implementation from .override directive in {11078}
		this._007B11078_007D();
	}

	private void _007B11079_007D()
	{
	}

	void ITKSerializable.PostInit()
	{
		//ILSpy generated this explicit interface implementation from .override directive in {11079}
		this._007B11079_007D();
	}

	private void _007B11080_007D(short _007B11081_007D, WriterExtern _007B11082_007D, out bool _007B11083_007D)
	{
		_007B11083_007D = true;
	}

	void ITKSerializable.Load(short _007B11081_007D, WriterExtern _007B11082_007D, out bool _007B11083_007D)
	{
		//ILSpy generated this explicit interface implementation from .override directive in {11080}
		this._007B11080_007D(_007B11081_007D, _007B11082_007D, out _007B11083_007D);
	}
}
