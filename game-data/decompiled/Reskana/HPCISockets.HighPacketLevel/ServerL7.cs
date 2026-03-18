using System;
using ManualPacketSerialization;

namespace HPCISockets.HighPacketLevel;

public class ServerL7
{
	private readonly struct Wrapper<T> : IWrapper where T : IMPSerializable
	{
		internal readonly ReceiverCallback<T> callback;

		public Wrapper(ReceiverCallback<T> _007B10711_007D)
		{
			callback = _007B10711_007D;
		}

		public void Complete(ref IMPSerializable _007B10712_007D)
		{
			T _007B10695_007D = (T)_007B10712_007D;
			callback(ref _007B10695_007D);
		}
	}

	private interface IWrapper
	{
		void Complete(ref IMPSerializable _007B10713_007D);
	}

	private class PacketRouter
	{
		public readonly bool IsTemporary;

		public readonly IWrapper Wrapper;

		public readonly ServerTaskType Flags;

		public PacketRouter(bool _007B10717_007D, IWrapper _007B10718_007D, ServerTaskType _007B10719_007D)
		{
			IsTemporary = _007B10717_007D;
			Wrapper = _007B10718_007D;
			Flags = _007B10719_007D;
		}
	}

	internal IReflectionSource typeConverter;

	private PacketRouter[] _007B10709_007D;

	public ServerL7(IReflectionSource _007B10702_007D)
	{
		typeConverter = _007B10702_007D;
		_007B10709_007D = new PacketRouter[_007B10702_007D.CountTypes + 1];
	}

	public void Add<T>(ReceiverCallback<T> _007B10703_007D, ServerTaskType _007B10704_007D = ServerTaskType.NotStated) where T : IMPSerializable
	{
		typeConverter.GetNUID(typeof(T), out var nuid);
		if (_007B10709_007D[nuid] != null)
		{
			throw new InvalidOperationException("Route for " + typeof(T)?.ToString() + " was added");
		}
		_007B10709_007D[nuid] = new PacketRouter(_007B10717_007D: false, new Wrapper<T>(_007B10703_007D), _007B10704_007D);
	}

	public void AddTemporary<T>(ReceiverCallback<T> _007B10705_007D, ServerTaskType _007B10706_007D = ServerTaskType.NotStated) where T : IMPSerializable
	{
		typeConverter.GetNUID(typeof(T), out var nuid);
		if (_007B10709_007D[nuid] != null)
		{
			throw new InvalidOperationException("Route for " + typeof(T)?.ToString() + " was added");
		}
		_007B10709_007D[nuid] = new PacketRouter(_007B10717_007D: true, new Wrapper<T>(_007B10705_007D), _007B10706_007D);
	}

	public void Dispose()
	{
		Array.Clear(_007B10709_007D, 0, _007B10709_007D.Length);
	}

	public ServerTaskType GetFlags(short _007B10707_007D)
	{
		if (_007B10707_007D < 0 || _007B10707_007D >= _007B10709_007D.Length || _007B10709_007D[_007B10707_007D] == null)
		{
			throw new InvalidOperationException("Route for packet ID " + _007B10707_007D + " was not found");
		}
		return _007B10709_007D[_007B10707_007D].Flags;
	}

	public void Proceed(ref UnboxingResult _007B10708_007D)
	{
		if (_007B10708_007D.TypeNUID < 0 || _007B10708_007D.TypeNUID >= _007B10709_007D.Length || _007B10709_007D[_007B10708_007D.TypeNUID] == null)
		{
			throw new InvalidOperationException("Route for packet " + _007B10708_007D.TypeNUID + " was not found (" + _007B10708_007D.FinalPacketType.Name + ")");
		}
		PacketRouter obj = _007B10709_007D[_007B10708_007D.TypeNUID];
		if (obj.IsTemporary)
		{
			_007B10709_007D[_007B10708_007D.TypeNUID] = null;
		}
		obj.Wrapper.Complete(ref _007B10708_007D.Packet);
	}
}
