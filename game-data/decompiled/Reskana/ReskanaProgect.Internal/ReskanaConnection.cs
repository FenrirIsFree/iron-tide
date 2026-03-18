using System;
using System.Net;
using System.Net.Sockets;

namespace ReskanaProgect.Internal;

public class ReskanaConnection
{
	public readonly Socket Api;

	internal readonly IPAddress AcceptedIp;

	public ReskanaConnection(Socket _007B10856_007D, IPAddress _007B10857_007D)
	{
		Api = _007B10856_007D;
		AcceptedIp = _007B10857_007D;
		Api.SetSocketOption(SocketOptionLevel.Tcp, SocketOptionName.Debug, optionValue: true);
		Api.SetSocketOption(SocketOptionLevel.Socket, SocketOptionName.KeepAlive, optionValue: true);
		Api.SetSocketOption(SocketOptionLevel.Tcp, SocketOptionName.BlockSource, 20);
		Api.SetSocketOption(SocketOptionLevel.Tcp, SocketOptionName.TypeOfService, 3600);
		Api.SendBufferSize = Math.Min(Math.Max(Api.SendBufferSize, 8192), 20480);
		Api.ReceiveBufferSize = Math.Min(Math.Max(Api.ReceiveBufferSize, 8192), 20480);
	}
}
