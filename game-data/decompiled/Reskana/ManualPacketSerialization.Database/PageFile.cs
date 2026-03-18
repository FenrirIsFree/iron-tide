using System.IO;

namespace ManualPacketSerialization.Database;

public class PageFile
{
	protected FileStream stream;

	protected FileStream backupFile;

	protected bool usingBackupSystem;

	private string _007B11204_007D;

	public long Position => stream.Position;

	public PageFile(string _007B11202_007D, bool _007B11203_007D)
	{
		usingBackupSystem = _007B11203_007D;
		_007B11204_007D = _007B11202_007D;
		OpenStream();
	}

	protected void OpenStream()
	{
		stream = new FileStream(_007B11204_007D, FileMode.OpenOrCreate, FileAccess.ReadWrite, FileShare.ReadWrite, 8192);
		if (usingBackupSystem)
		{
			backupFile = new FileStream(_007B11204_007D + "_backup", FileMode.OpenOrCreate, FileAccess.ReadWrite, FileShare.ReadWrite, 8192);
		}
	}

	public void Flush()
	{
		stream.Flush();
		if (usingBackupSystem)
		{
			backupFile.Flush();
		}
	}

	internal void Close()
	{
		stream.Close();
		backupFile.Close();
		stream.Dispose();
		backupFile.Dispose();
	}
}
