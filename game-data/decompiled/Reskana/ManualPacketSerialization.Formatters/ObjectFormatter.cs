using System;
using System.Runtime;
using ManualPacketSerialization.Externs;

namespace ManualPacketSerialization.Formatters;

internal static class ObjectFormatter
{
	[TargetedPatchingOptOut("Performance critical to inline across NGen image boundaries")]
	public static void Unpack<T>(WriterExtern _007B10938_007D, out T _007B10939_007D) where T : IMPSerializable
	{
		_007B10939_007D = default(T);
		if (_007B10939_007D == null)
		{
			_007B10939_007D = Activator.CreateInstance<T>();
		}
		_007B10939_007D.Unboxing(_007B10938_007D);
	}
}
