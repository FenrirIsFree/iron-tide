using System;
using System.Net.Sockets;

namespace ReskanaProgect.Network;

public struct BrokenConnectionInfo
{
	public SocketError? BySocketError;

	public Exception ByException;

	public bool ByMalformation;

	public bool ClientWasDisconnected;

	public string MoreInfo;

	public BrokenConnectionInfo(SocketError _007B10800_007D, bool _007B10801_007D)
	{
		BySocketError = _007B10800_007D;
		ClientWasDisconnected = _007B10801_007D;
		ByException = null;
		ByMalformation = false;
		MoreInfo = string.Empty;
	}

	public BrokenConnectionInfo(Exception _007B10802_007D, bool _007B10803_007D)
	{
		ByException = _007B10802_007D;
		ClientWasDisconnected = _007B10803_007D;
		BySocketError = null;
		ByMalformation = false;
		MoreInfo = string.Empty;
	}

	public BrokenConnectionInfo(bool _007B10804_007D)
	{
		ByMalformation = !_007B10804_007D;
		ClientWasDisconnected = _007B10804_007D;
		ByException = null;
		BySocketError = null;
		MoreInfo = string.Empty;
	}

	public override string ToString()
	{
		return (ClientWasDisconnected ? "Disconnected" : (ByMalformation ? "Checksum error" : (BySocketError.HasValue ? $"Error {BySocketError.Value}" : ((ByException != null) ? ("Exception " + ByException.Message) : "Unknown error")))) + (string.IsNullOrEmpty(MoreInfo) ? string.Empty : (" " + MoreInfo));
	}
}
