using System;
using ManualPacketSerialization.Externs;

namespace ManualPacketSerialization.Database;

public struct MPSKeyFieldInformation<T>
{
	internal byte FieldPublicID;

	internal Func<T, object> GetValue;

	internal Action<T> WriteBalue;

	internal Func<T, WriterExtern> ReadValue;

	public MPSKeyFieldInformation(byte _007B11223_007D, Func<T, object> _007B11224_007D, Action<T> _007B11225_007D, Func<T, WriterExtern> _007B11226_007D)
	{
		FieldPublicID = _007B11223_007D;
		GetValue = _007B11224_007D;
		WriteBalue = _007B11225_007D;
		ReadValue = _007B11226_007D;
	}
}
