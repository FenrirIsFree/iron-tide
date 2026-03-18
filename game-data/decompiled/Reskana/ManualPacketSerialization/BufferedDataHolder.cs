using System;
using System.IO;

namespace ManualPacketSerialization;

public sealed class BufferedDataHolder
{
	public byte[] UsedBuffer;

	public int StartIndex;

	public int LastOperationBytesCount;

	public object Tag;

	public BufferedDataHolder(byte[] _007B10863_007D, int _007B10864_007D)
	{
		UsedBuffer = _007B10863_007D;
		StartIndex = _007B10864_007D;
	}

	public void WriteTo(Stream _007B10865_007D)
	{
		_007B10865_007D.Write(UsedBuffer, StartIndex, LastOperationBytesCount);
	}

	public BufferedDataHolder CloneWithCopyAllBuffer()
	{
		byte[] array = new byte[UsedBuffer.Length];
		Buffer.BlockCopy(UsedBuffer, 0, array, 0, UsedBuffer.Length);
		return new BufferedDataHolder(array, StartIndex)
		{
			LastOperationBytesCount = LastOperationBytesCount
		};
	}
}
