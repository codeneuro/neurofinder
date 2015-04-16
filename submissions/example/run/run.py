def run(data):
    """
    Run a source extraction algorithm on an Images object
    """
    from thunder import SourceExtraction
    method = SourceExtraction('localmax')
    result = method.fit(data)
    return result
