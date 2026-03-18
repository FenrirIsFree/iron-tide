using ManualPacketSerialization.Externs;

namespace ManualPacketSerialization;

public interface IMPSerializable
{
	void Boxing(WriterExtern _007B10910_007D);

	void Unboxing(WriterExtern _007B10911_007D);
}
