using System;

namespace ReskanaProgect;

public class Config
{
	public const int SaeaBufferSize = 20480;

	public const int MinInternalBuffer = 8192;

	public static int BacklogSize = 10;

	public const int SendQueueGrow = 4096;

	public const int MaxSendQueueSize = 1048576;

	public const int MaxExceedingTheWindow = 2;

	public static Action<string> InternalErrorsLogger;

	public static int MaxPacketSize => 40960;

	public static bool DisableSaeaPool { get; set; }
}
