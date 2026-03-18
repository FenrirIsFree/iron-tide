namespace ReskanaProgect;

public struct BufferSegmentStruct
{
	public byte[] Buffer;

	public int StartPosition;

	public int Length;

	public BufferSegmentStruct(byte[] _007B10723_007D, int _007B10724_007D, int _007B10725_007D)
	{
		Buffer = _007B10723_007D;
		StartPosition = _007B10724_007D;
		Length = _007B10725_007D;
	}
}
