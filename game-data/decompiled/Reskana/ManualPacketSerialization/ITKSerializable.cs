using ManualPacketSerialization.Externs;

namespace ManualPacketSerialization;

public interface ITKSerializable
{
	void PreInit();

	void PostInit();

	void Load(short _007B10912_007D, WriterExtern _007B10913_007D, out bool _007B10914_007D);

	void Boxing(TKWriterExtern _007B10915_007D);
}
