using System;
using System.IO;
using ManualPacketSerialization.Externs;
using ManualPacketSerialization.Formatters;

namespace ManualPacketSerialization;

public sealed class DeltaStream
{
	private class Session
	{
		public WriterExtern writer = new WriterExtern();

		public WriterExtern reader = new WriterExtern();
	}

	public class NoReflection : IReflectionSource
	{
		public int CountTypes => 1;

		public void GetNUID(Type _007B10906_007D, out short _007B10907_007D)
		{
			_007B10907_007D = 0;
		}

		public IMPSerializable GetStructureInstance(short _007B10908_007D, out Type _007B10909_007D)
		{
			_007B10909_007D = null;
			return null;
		}
	}

	[ThreadStatic]
	private static Session session;

	public const string fileExtensionTk = ".tkformatter";

	public static volatile int OpenMPToDiskOperations;

	public static volatile int OpenTKToDiskOperations;

	public static readonly NoReflection NoReflectionInstance = new NoReflection();

	public unsafe static void Boxing(IReflectionSource _007B10866_007D, IMPSerializable _007B10867_007D, BufferedDataHolder _007B10868_007D, bool _007B10869_007D = false)
	{
		if (session == null)
		{
			session = new Session();
		}
		WriterExtern writer = session.writer;
		writer.Initialize(_007B10868_007D.UsedBuffer, _007B10868_007D.StartIndex);
		if (_007B10869_007D)
		{
			writer.Continue(2);
		}
		_007B10866_007D.GetNUID(_007B10867_007D.GetType(), out var nuid);
		writer.WriteStruct(nuid);
		_007B10867_007D.Boxing(writer);
		if (_007B10869_007D)
		{
			short num = (short)(writer.Position - _007B10868_007D.StartIndex);
			fixed (byte* ptr = &writer._buffer[0])
			{
				*(short*)ptr = num;
			}
		}
		_007B10868_007D.LastOperationBytesCount = writer.Position - _007B10868_007D.StartIndex;
	}

	public static int BoxingToFile(IMPSerializable _007B10870_007D, string _007B10871_007D, bool _007B10872_007D, int _007B10873_007D = 65536)
	{
		OpenMPToDiskOperations++;
		BufferedDataHolder bufferedDataHolder = new BufferedDataHolder(new byte[_007B10873_007D], 0);
		Boxing(NoReflectionInstance, _007B10870_007D, bufferedDataHolder);
		InternalFileWriter(_007B10871_007D, bufferedDataHolder, _007B10872_007D);
		OpenMPToDiskOperations--;
		return bufferedDataHolder.LastOperationBytesCount;
	}

	public static int BoxingToFile(Action<WriterExtern> _007B10874_007D, string _007B10875_007D, BufferedDataHolder _007B10876_007D, bool _007B10877_007D)
	{
		WriterExtern writerExtern = new WriterExtern();
		writerExtern.Initialize(_007B10876_007D.UsedBuffer, 0);
		_007B10874_007D(writerExtern);
		writerExtern.GetWriteAmount(out _007B10876_007D.LastOperationBytesCount);
		InternalFileWriter(IOPathBuilder(_007B10875_007D), _007B10876_007D, _007B10877_007D);
		return _007B10876_007D.LastOperationBytesCount;
	}

	public static void Unboxing(IReflectionSource _007B10878_007D, byte[] _007B10879_007D, int _007B10880_007D, int _007B10881_007D, out UnboxingResult _007B10882_007D, bool _007B10883_007D = false)
	{
		if (session == null)
		{
			session = new Session();
		}
		WriterExtern reader = session.reader;
		reader.Initialize(_007B10879_007D, _007B10881_007D);
		if (_007B10880_007D < 2)
		{
			_007B10882_007D = new UnboxingResult(UnboxingError.LessBytes);
			return;
		}
		if (_007B10883_007D)
		{
			reader.ReadStruct<short>(out var _007B11041_007D);
			if (((_007B11041_007D < 0) ? (_007B11041_007D + 65535) : _007B11041_007D) > _007B10880_007D)
			{
				_007B10882_007D = new UnboxingResult(UnboxingError.LessBytes);
				return;
			}
		}
		reader.ReadStruct<short>(out var _007B11041_007D2);
		Type type;
		IMPSerializable structureInstance = _007B10878_007D.GetStructureInstance(_007B11041_007D2, out type);
		if (structureInstance == null)
		{
			_007B10882_007D = new UnboxingResult(UnboxingError.PacketIdError);
			return;
		}
		_007B10882_007D.FinalPacketType = type;
		structureInstance.Unboxing(reader);
		int _007B10933_007D = reader.Position - _007B10881_007D;
		_007B10882_007D = new UnboxingResult(structureInstance, type, _007B10933_007D, _007B11041_007D2);
	}

	public static void UnboxingFromFile<T>(string _007B10884_007D, T _007B10885_007D) where T : IMPSerializable
	{
		OpenMPToDiskOperations++;
		if (!File.Exists(_007B10884_007D))
		{
			throw new FileNotFoundException();
		}
		if (session == null)
		{
			session = new Session();
		}
		WriterExtern reader = session.reader;
		int _007B11016_007D = 2;
		byte[] _007B11015_007D = File.ReadAllBytes(_007B10884_007D);
		reader.Initialize(_007B11015_007D, _007B11016_007D);
		_007B10885_007D.Unboxing(reader);
		OpenMPToDiskOperations--;
	}

	public static string IOPathBuilder(string _007B10886_007D)
	{
		string extension = Path.GetExtension(_007B10886_007D);
		if (string.IsNullOrEmpty(extension))
		{
			return _007B10886_007D + ".tkformatter";
		}
		if (string.Equals(".tkformatter", extension))
		{
			return _007B10886_007D;
		}
		throw new InvalidDataException();
	}

	public static void BoxingTk(ITKSerializable _007B10887_007D, BufferedDataHolder _007B10888_007D)
	{
		if (session == null)
		{
			session = new Session();
		}
		WriterExtern writer = session.writer;
		writer.Initialize(_007B10888_007D.UsedBuffer, _007B10888_007D.StartIndex);
		TKObjectFormatter.Pack(new TKWriterExtern(writer), ref _007B10887_007D);
		_007B10888_007D.LastOperationBytesCount = writer.Position - _007B10888_007D.StartIndex;
	}

	public static T UnboxingTk<T>(BufferedDataHolder _007B10889_007D) where T : ITKSerializable
	{
		if (session == null)
		{
			session = new Session();
		}
		WriterExtern reader = session.reader;
		reader.Initialize(_007B10889_007D.UsedBuffer, _007B10889_007D.StartIndex);
		_007B10889_007D.LastOperationBytesCount = TKObjectFormatter.Unpack<T>(reader, out var _007B10963_007D);
		_007B10889_007D.StartIndex += _007B10889_007D.LastOperationBytesCount + 4;
		return _007B10963_007D;
	}

	public static int BoxingToFileTK(ITKSerializable _007B10890_007D, string _007B10891_007D, BufferedDataHolder _007B10892_007D, bool _007B10893_007D)
	{
		OpenTKToDiskOperations++;
		BoxingTk(_007B10890_007D, _007B10892_007D);
		InternalFileWriter(IOPathBuilder(_007B10891_007D), _007B10892_007D, _007B10893_007D);
		OpenTKToDiskOperations--;
		return _007B10892_007D.LastOperationBytesCount;
	}

	public static bool UnboxingFromFileTk(string _007B10894_007D, Action<WriterExtern> _007B10895_007D)
	{
		string path = IOPathBuilder(_007B10894_007D);
		if (!File.Exists(path))
		{
			return false;
		}
		byte[] _007B11015_007D = File.ReadAllBytes(path);
		WriterExtern writerExtern = new WriterExtern();
		writerExtern.Initialize(_007B11015_007D, 0);
		_007B10895_007D(writerExtern);
		return true;
	}

	private static void ModernFlushHelper(FileStream _007B10896_007D, WriterExtern _007B10897_007D)
	{
		if (_007B10897_007D.Position > 0)
		{
			_007B10896_007D.Write(_007B10897_007D._buffer, 0, _007B10897_007D.Position);
			_007B10897_007D.Position = 0;
		}
	}

	public static T UnboxingFromFileTK<T>(string _007B10898_007D) where T : ITKSerializable
	{
		OpenTKToDiskOperations++;
		string path = IOPathBuilder(_007B10898_007D);
		if (!File.Exists(path))
		{
			OpenTKToDiskOperations--;
			return default(T);
		}
		BufferedDataHolder _007B10889_007D = new BufferedDataHolder(File.ReadAllBytes(path), 0);
		OpenTKToDiskOperations--;
		return UnboxingTk<T>(_007B10889_007D);
	}

	private static int ioBufferSize(int _007B10899_007D)
	{
		if (_007B10899_007D <= 1024)
		{
			return 1024;
		}
		return 4096;
	}

	public static void InternalFileWriter(string _007B10900_007D, BufferedDataHolder _007B10901_007D, bool _007B10902_007D)
	{
		if (_007B10902_007D)
		{
			AtomicWrite(_007B10900_007D, new ReadOnlySpan<byte>(_007B10901_007D.UsedBuffer, _007B10901_007D.StartIndex, _007B10901_007D.LastOperationBytesCount));
			return;
		}
		using FileStream fileStream = new FileStream(_007B10900_007D, FileMode.OpenOrCreate, FileAccess.Write, FileShare.ReadWrite, ioBufferSize(_007B10901_007D.LastOperationBytesCount), useAsync: false);
		if (fileStream.Length > _007B10901_007D.LastOperationBytesCount + 4096)
		{
			fileStream.SetLength(_007B10901_007D.LastOperationBytesCount);
		}
		fileStream.Write(_007B10901_007D.UsedBuffer, _007B10901_007D.StartIndex, _007B10901_007D.LastOperationBytesCount);
	}

	public static void AtomicWrite(string _007B10903_007D, ReadOnlySpan<byte> _007B10904_007D)
	{
		string text = Path.Combine(Path.GetDirectoryName(Path.GetFullPath(_007B10903_007D)) ?? throw new ArgumentException("Invalid path", "fileName"), Path.GetFileName(_007B10903_007D) + "." + Guid.NewGuid().ToString("N") + ".tmp");
		FileStream fileStream = null;
		try
		{
			fileStream = new FileStream(text, FileMode.CreateNew, FileAccess.Write, FileShare.None, Math.Min(Math.Max(4096, _007B10904_007D.Length), 65536), FileOptions.WriteThrough | FileOptions.SequentialScan);
			fileStream.Write(_007B10904_007D);
			fileStream.Flush(flushToDisk: true);
			fileStream.Dispose();
			fileStream = null;
			for (int i = 0; i < 2; i++)
			{
				try
				{
					if (File.Exists(_007B10903_007D))
					{
						File.Replace(text, _007B10903_007D, null, ignoreMetadataErrors: true);
					}
					else
					{
						File.Move(text, _007B10903_007D);
					}
					break;
				}
				catch (IOException ex)
				{
					if (!ex.Message.Contains("cannot access"))
					{
						throw;
					}
				}
			}
		}
		finally
		{
			fileStream?.Dispose();
			TryDelete(text);
		}
	}

	private static void TryDelete(string _007B10905_007D)
	{
		try
		{
			if (File.Exists(_007B10905_007D))
			{
				File.Delete(_007B10905_007D);
			}
		}
		catch
		{
		}
	}
}
