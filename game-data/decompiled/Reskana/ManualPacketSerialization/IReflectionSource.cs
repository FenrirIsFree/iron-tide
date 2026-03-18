using System;

namespace ManualPacketSerialization;

public interface IReflectionSource
{
	int CountTypes { get; }

	void GetNUID(Type type, out short nuid);

	IMPSerializable GetStructureInstance(short nuid, out Type type);
}
