using System;
using System.Runtime.InteropServices;

namespace Reskana_7_0.Network;

internal class Protocol
{
	[StructLayout(LayoutKind.Explicit, Size = 5)]
	public struct InternalHeader
	{
		public const int length = 5;

		[FieldOffset(0)]
		public ushort totalLength;

		[FieldOffset(2)]
		public ushort hash;

		[FieldOffset(4)]
		public byte control;

		public InternalHeader(ushort _007B10688_007D, ushort _007B10689_007D, byte _007B10690_007D)
		{
			totalLength = _007B10688_007D;
			hash = _007B10689_007D;
			control = _007B10690_007D;
		}
	}

	private const bool Encryption = true;

	public unsafe static ushort FxtcpComputeChecksum(byte[] _007B10664_007D, int _007B10665_007D, int _007B10666_007D)
	{
		try
		{
			int num = _007B10666_007D / 4;
			int num2 = _007B10666_007D % 4;
			uint num3 = 31u;
			fixed (byte* ptr = &_007B10664_007D[_007B10665_007D])
			{
				for (int i = 0; i < num; i++)
				{
					num3 = 2 * num3 + *(uint*)(ptr + i * 4);
				}
				for (int j = 0; j < num2; j++)
				{
					num3 = 2 * num3 + ptr[num * 4 + j];
				}
			}
			num3 ^= num3 << 3;
			num3 += num3 >> 5;
			num3 ^= num3 << 4;
			num3 += num3 >> 17;
			num3 ^= num3 << 25;
			num3 += num3 >> 6;
			return (ushort)(num3 % 65535);
		}
		catch (IndexOutOfRangeException)
		{
			return 0;
		}
	}

	public static void PayloadEncode(byte[] _007B10667_007D, int _007B10668_007D, byte[] _007B10669_007D, int _007B10670_007D, int _007B10671_007D, uint _007B10672_007D)
	{
		XorTransform64(_007B10667_007D, _007B10668_007D, _007B10669_007D, _007B10670_007D, _007B10671_007D, _007B10672_007D);
	}

	public static void PayloadDecode(byte[] _007B10673_007D, int _007B10674_007D, byte[] _007B10675_007D, int _007B10676_007D, int _007B10677_007D, uint _007B10678_007D)
	{
		XorTransform64(_007B10673_007D, _007B10674_007D, _007B10675_007D, _007B10676_007D, _007B10677_007D, _007B10678_007D);
	}

	public unsafe static void XorTransform64(byte[] _007B10679_007D, int _007B10680_007D, byte[] _007B10681_007D, int _007B10682_007D, int _007B10683_007D, uint _007B10684_007D)
	{
		fixed (byte* ptr = _007B10679_007D)
		{
			fixed (byte* ptr2 = _007B10681_007D)
			{
				uint num = _007B10684_007D;
				int num2 = _007B10683_007D / 8;
				int num3 = _007B10683_007D % 8;
				for (int i = 0; i < num2; i++)
				{
					num = num * 1664525 + 1013904223;
					ulong num4 = (ulong)num << 32;
					num = num * 1664525 + 1013904223;
					num4 |= num;
					int num5 = i * 8;
					*(long*)(ptr2 + (_007B10682_007D + num5)) = *(long*)(ptr + (_007B10680_007D + num5)) ^ (long)num4;
				}
				if (num3 > 0)
				{
					int num6 = num2 * 8;
					for (int j = 0; j < num3; j++)
					{
						num = num * 1664525 + 1013904223;
						byte b = (byte)(num >> 24);
						ptr2[_007B10682_007D + num6 + j] = (byte)(ptr[_007B10680_007D + num6 + j] ^ b);
					}
				}
			}
		}
	}
}
