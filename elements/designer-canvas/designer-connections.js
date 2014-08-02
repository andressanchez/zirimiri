var _connections = {};

function addConnection(source, target, arrow)
{
    if (_connections[source.id] == null) _connections[source.id] = [];
    if (_connections[target.id] == null) _connections[target.id] = [];
    var link = {source: source, target: target, arrow: arrow};
    _connections[source.id].push(link);
    _connections[target.id].push(link);
}

function getConnections(source)
{
    return _connections[source.id];
}

function resetConnections()
{
    _connections = {};
}

function removeComponentConnections(component)
{
    var newConnections = {};

    for (var key in _connections)
    {
        _connections[key].forEach(function (connection) {
            if (connection.source.id == component.id || connection.target.id == component.id) {
                connection.arrow.arrowPath.remove();
                connection.arrow.linePath.remove();
            }
            else {
                if (newConnections[key] == null) newConnections[key] = [];
                newConnections[key].push(connection);
            }
        });
    }
    _connections = newConnections;
}