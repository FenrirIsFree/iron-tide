using System;
using System.Text;

namespace ManualPacketSerialization;

public struct UnboxingResult
{
	public readonly UnboxingError Error;

	public IMPSerializable Packet;

	public Type FinalPacketType;

	public readonly int LengthInBytes;

	public short TypeNUID;

	public UnboxingResult(UnboxingError _007B10930_007D)
	{
		if (_007B10930_007D == UnboxingError.Success)
		{
			throw new InvalidOperationException();
		}
		Error = _007B10930_007D;
		Packet = null;
		FinalPacketType = null;
		LengthInBytes = 0;
		TypeNUID = 0;
	}

	public UnboxingResult(IMPSerializable _007B10931_007D, Type _007B10932_007D, int _007B10933_007D, short _007B10934_007D)
	{
		Error = UnboxingError.Success;
		Packet = _007B10931_007D;
		FinalPacketType = _007B10932_007D;
		LengthInBytes = _007B10933_007D;
		TypeNUID = _007B10934_007D;
	}

	public override string ToString()
	{
		StringBuilder stringBuilder = new StringBuilder();
		stringBuilder.Append("UnboxingResult: Packet=");
		stringBuilder.Append(FinalPacketType.Name);
		stringBuilder.Append(", Size=");
		stringBuilder.Append(LengthInBytes);
		return stringBuilder.ToString();
	}
}
